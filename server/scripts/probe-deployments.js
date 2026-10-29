const https = require('https');

function get(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...headers
      }
    };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function probe() {
  console.log('--- Probing Vercel Frontend (cache-busted) ---');
  try {
    const frontend = await get(`https://the-tech-mystery.vercel.app/?v=${Date.now()}`);
    console.log('Frontend HTTP Status:', frontend.status);
    console.log('Vercel Cache:', frontend.headers['x-vercel-cache']);
    console.log('Age:', frontend.headers['age']);
    const match = frontend.body.match(/src="\/assets\/(index-[^"]+\.js)"/);
    console.log('Script bundle:', match ? match[1] : 'none');
  } catch (e) {
    console.error('Frontend error:', e.message);
  }

  console.log('\n--- Probing Render Backend ---');
  try {
    const backend = await get('https://tech-mystery.onrender.com/api/v1/health');
    console.log('Backend HTTP Status:', backend.status);
    try {
      const parsed = JSON.parse(backend.body);
      console.log('Backend Uptime (s):', parsed.data?.uptime);
      console.log('Backend Status:', parsed.data?.status);
      console.log('Database:', parsed.data?.database);
      console.log('Event State:', parsed.data?.event?.state);
    } catch {
      console.log('Raw body:', backend.body.slice(0, 200));
    }
  } catch (e) {
    console.error('Backend error:', e.message);
  }
}

probe();
