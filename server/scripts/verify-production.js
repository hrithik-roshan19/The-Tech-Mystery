const https = require('https');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'ProductionVerificationProbe/1.0',
        'Accept': 'application/json, text/html',
        ...(options.headers || {})
      }
    };

    const req = https.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch {}
        resolve({ status: res.statusCode, headers: res.headers, body: data, json });
      });
    });

    req.on('error', reject);
    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }
    req.end();
  });
}

async function verifyProduction() {
  console.log('====================================================');
  console.log('   PRODUCTION VERIFICATION: THE TECH MYSTERY       ');
  console.log('   Frontend: https://the-tech-mystery.vercel.app    ');
  console.log('   Backend:  https://tech-mystery.onrender.com      ');
  console.log('====================================================\n');

  let passes = 0;
  let fails = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passes++;
    } else {
      console.error(`[FAIL] ${message}`);
      fails++;
    }
  }

  // 1. Frontend Homepage Load
  console.log('--- 1. Frontend Homepage & Asset Deployment ---');
  const home = await request('https://the-tech-mystery.vercel.app');
  assert(home.status === 200, 'Frontend returns HTTP 200 OK');
  assert(home.body.includes('<title>The Tech Mystery | CodeSphere CTF</title>'), 'Frontend serves correct HTML title');
  const bundleMatch = home.body.match(/src="\/assets\/(index-[^"]+\.js)"/);
  assert(Boolean(bundleMatch), `Frontend loads built bundle: ${bundleMatch ? bundleMatch[1] : 'NONE'}`);

  // 2. Backend Health & Connectivity
  console.log('\n--- 2. Backend API Health & Architecture ---');
  const health = await request('https://tech-mystery.onrender.com/api/v1/health');
  assert(health.status === 200, 'Health endpoint returns HTTP 200');
  assert(health.json?.data?.status === 'ONLINE', 'Backend reports status ONLINE');
  assert(health.json?.data?.database === 'connected', 'MongoDB connection is ACTIVE');
  assert(health.json?.data?.event?.state === 'LIVE', 'Event is currently in LIVE state for gameplay');
  assert(health.json?.data?.auth?.provider === 'clerk', 'Clerk authentication provider is active');

  // 3. Leaderboard Public Endpoint
  console.log('\n--- 3. Public Leaderboard API ---');
  const leaderboard = await request('https://tech-mystery.onrender.com/api/v1/leaderboard');
  assert(leaderboard.status === 200, 'Leaderboard endpoint returns HTTP 200');
  assert(Array.isArray(leaderboard.json?.data?.leaderboard), 'Leaderboard data array is present');
  assert(!JSON.stringify(leaderboard.json).includes('flag'), 'Leaderboard never leaks flags or answers');

  // 4. Checkpoint Verification Endpoints (HTG-CP01, HTG-CP02, HTG-CP03)
  console.log('\n--- 4. Checkpoint Verification Security ---');
  // Check that verification without auth requires authorization
  const scanUnauth = await request('https://tech-mystery.onrender.com/api/v1/checkpoints/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { checkpointCode: 'HTG-CP01', token: 'invalid_token' }
  });
  assert([401, 403].includes(scanUnauth.status), `Unauthenticated checkpoint scan is rejected with 401/403 (got ${scanUnauth.status})`);

  // Check that checkpoint scan without valid token is rejected safely
  const scanNoToken = await request('https://tech-mystery.onrender.com/api/v1/checkpoints/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { checkpointCode: 'HTG-CP01' }
  });
  assert([401, 403].includes(scanNoToken.status), `Unsigned checkpoint scan is rejected with 401/403 (got ${scanNoToken.status})`);

  // 5. Protected Question & Challenge Endpoints
  console.log('\n--- 5. Challenge & Question Answer Protection ---');
  const currentCh = await request('https://tech-mystery.onrender.com/api/v1/challenges/current');
  assert(currentCh.status === 401, `Anonymous challenge access is strictly blocked with 401 Unauthorized (got ${currentCh.status})`);
  assert(!JSON.stringify(currentCh.json).includes('flag'), '401 challenge response does not echo flags');

  const adminQuestions = await request('https://tech-mystery.onrender.com/api/v1/admin/questions');
  assert(adminQuestions.status === 401, `Anonymous admin questions endpoint is strictly blocked with 401 Unauthorized (got ${adminQuestions.status})`);

  // 6. Security Headers & Proxy Configuration
  console.log('\n--- 6. Security Headers & CORS ---');
  assert(health.headers['content-security-policy'] !== undefined, 'Content-Security-Policy header is present');
  assert(health.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff is enforced');
  assert(health.headers['access-control-allow-origin'] === 'https://the-tech-mystery.vercel.app', 'CORS origin is locked to https://the-tech-mystery.vercel.app');

  console.log('\n====================================================');
  console.log(`VERIFICATION SUMMARY: ${passes} Passed, ${fails} Failed`);
  console.log('====================================================\n');
}

verifyProduction().catch(console.error);
