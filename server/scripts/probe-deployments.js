const https = require('https');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function probe() {
  console.log('--- Checking New Asset Bundle on Vercel ---');
  try {
    const asset = await get('https://the-tech-mystery.vercel.app/assets/index-DTOdK20Z.js');
    console.log('New Bundle (index-DTOdK20Z.js) Status:', asset.status);
    console.log('Content-Length:', asset.headers['content-length']);
    console.log('Age:', asset.headers['age']);
  } catch (e) {
    console.error('Asset check error:', e.message);
  }

  console.log('\n--- Checking Root on Vercel ---');
  try {
    const root = await get('https://the-tech-mystery.vercel.app');
    console.log('Root Status:', root.status);
    console.log('Age:', root.headers['age']);
    console.log('Cache:', root.headers['x-vercel-cache']);
    const match = root.body.match(/src="\/assets\/(index-[^"]+\.js)"/);
    console.log('Root index.html references:', match ? match[1] : 'none');
  } catch (e) {
    console.error('Root check error:', e.message);
  }

  console.log('\n--- Checking Backend on Render ---');
  try {
    const backend = await get('https://tech-mystery.onrender.com/api/v1/health');
    console.log('Health Status:', backend.status);
    const parsed = JSON.parse(backend.body);
    console.log('Uptime:', parsed.data?.uptime);
    console.log('Status:', parsed.data?.status);
    console.log('Database:', parsed.data?.database);
  } catch (e) {
    console.error('Backend check error:', e.message);
  }
}

probe();
