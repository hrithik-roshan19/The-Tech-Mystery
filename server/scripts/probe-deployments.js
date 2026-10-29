const https = require('https');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request({
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'GET',
      headers: {
        'User-Agent': 'Deployment-Verification/1.0',
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout requesting ${url}`));
    });
    req.end();
  });
}

function requestOptions(url, origin) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const req = https.request({
      protocol: parsedUrl.protocol,
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout requesting OPTIONS ${url}`));
    });
    req.end();
  });
}

async function run() {
  console.log('====================================================');
  console.log('PRODUCTION RELEASE VERIFICATION PROBE');
  console.log('Timestamp:', new Date().toISOString());
  console.log('====================================================\n');

  console.log('--- 1. Backend Health Check (Render) ---');
  try {
    const health = await get('https://tech-mystery.onrender.com/api/v1/health');
    console.log('HTTP Status:', health.status);
    console.log('Response Body:', health.body);
  } catch (err) {
    console.error('Backend Health Error:', err.message);
  }

  console.log('\n--- 2. Backend CORS Preflight Check ---');
  try {
    const cors = await requestOptions('https://tech-mystery.onrender.com/api/v1/health', 'https://the-tech-mystery.vercel.app');
    console.log('Preflight HTTP Status:', cors.status);
    console.log('Access-Control-Allow-Origin:', cors.headers['access-control-allow-origin']);
    console.log('Access-Control-Allow-Credentials:', cors.headers['access-control-allow-credentials']);
    console.log('Access-Control-Allow-Methods:', cors.headers['access-control-allow-methods']);
  } catch (err) {
    console.error('Backend CORS Error:', err.message);
  }

  console.log('\n--- 3. Public Challenges Endpoint Smoke Test ---');
  try {
    const challenges = await get('https://tech-mystery.onrender.com/api/v1/challenges');
    console.log('Challenges HTTP Status:', challenges.status);
    const parsed = JSON.parse(challenges.body);
    const data = parsed.data || parsed;
    console.log('Is Array?:', Array.isArray(data));
    console.log('Total Challenges:', Array.isArray(data) ? data.length : 'N/A');
    if (Array.isArray(data) && data.length > 0) {
      console.log('Sample Challenge fields:', Object.keys(data[0]));
      // Verify flag withholding / redaction
      const leakedFlag = data.some(c => c.flag || c.secretFlag || (c.questions && c.questions.some(q => q.flag)));
      console.log('Are flags withheld / zero leak?:', !leakedFlag);
    }
  } catch (err) {
    console.error('Challenges Error:', err.message);
  }

  console.log('\n--- 4. Public Leaderboard Smoke Test ---');
  try {
    const lb = await get('https://tech-mystery.onrender.com/api/v1/leaderboard');
    console.log('Leaderboard HTTP Status:', lb.status);
    const parsed = JSON.parse(lb.body);
    console.log('Leaderboard Success?:', parsed.success);
    const count = parsed.data ? parsed.data.length : 'N/A';
    console.log('Leaderboard Teams Count:', count);
  } catch (err) {
    console.error('Leaderboard Error:', err.message);
  }

  console.log('\n--- 5. Admin Questions Unauthorized Protection Test ---');
  try {
    const unauthAdmin = await get('https://tech-mystery.onrender.com/api/v1/admin/questions');
    console.log('Unauth Admin Questions Status (expected 401):', unauthAdmin.status);
  } catch (err) {
    console.error('Admin Questions Protection Error:', err.message);
  }

  console.log('\n--- 6. Frontend Vercel Live Deployment Check ---');
  try {
    const fe = await get('https://the-tech-mystery.vercel.app/?t=' + Date.now(), {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    console.log('Frontend HTTP Status:', fe.status);
    console.log('x-vercel-cache:', fe.headers['x-vercel-cache']);
    console.log('age:', fe.headers['age']);
    const match = fe.body.match(/src="\/assets\/(index-[^"]+\.js)"/);
    console.log('Active JS Bundle referenced in index.html:', match ? match[1] : 'none');
    
    // Check if new bundle is accessible
    if (match) {
      const bundle = await get('https://the-tech-mystery.vercel.app/assets/' + match[1]);
      console.log('Bundle fetch status:', bundle.status, 'size:', bundle.headers['content-length'] || bundle.body.length);
    }
  } catch (err) {
    console.error('Frontend Check Error:', err.message);
  }

  console.log('\n====================================================');
  console.log('PROBE COMPLETE');
  console.log('====================================================');
}

run();
