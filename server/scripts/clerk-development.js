// Opt-in, disposable verification runtime. Never reads a configured MongoDB URI.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { MongoMemoryReplSet } = require('mongodb-memory-server');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

const projectRoot = path.resolve(__dirname, '../..');
const origin = 'http://127.0.0.1:5175';
const apiOrigin = 'http://127.0.0.1:5101';

function credentials(files) {
  // Only explicit files; neither the existing DB URI nor live app config is copied.
  const values = Object.assign({}, ...files.map(file => dotenv.parse(fs.readFileSync(path.resolve(file)))));
  for (const name of ['CLERK_SECRET_KEY', 'CLERK_JWT_ISSUER_DOMAIN', 'CLERK_AUTHORIZED_PARTIES',
    'VITE_CLERK_PUBLISHABLE_KEY', 'CLERK_JWT_KEY']) {
    if (process.env[name]) values[name] = process.env[name];
  }
  // Non-secret defaults for this owned runtime only; never modify an env file.
  if (/^pk_test_[A-Za-z0-9=]+$/.test(values.VITE_CLERK_PUBLISHABLE_KEY || '')) {
    const domain = Buffer.from(values.VITE_CLERK_PUBLISHABLE_KEY.slice('pk_test_'.length), 'base64').toString('utf8').replace(/\$$/, '');
    if (/^[A-Za-z0-9.-]+$/.test(domain)) {
      values.CLERK_JWT_ISSUER_DOMAIN ||= `https://${domain}`;
      values.CLERK_AUTHORIZED_PARTIES ||= origin;
    }
  }
  const required = ['CLERK_SECRET_KEY', 'CLERK_JWT_ISSUER_DOMAIN', 'CLERK_AUTHORIZED_PARTIES', 'VITE_CLERK_PUBLISHABLE_KEY'];
  const missing = required.filter(name => !values[name] || /placeholder|replace|<|>/.test(values[name]));
  if (missing.length) throw new Error(`Missing configuration: ${missing.join(', ')}`);
  assert.match(values.CLERK_SECRET_KEY, /^sk_test_[A-Za-z0-9]+$/, 'Development secret key required');
  assert.match(values.VITE_CLERK_PUBLISHABLE_KEY, /^pk_test_[A-Za-z0-9=]+$/, 'Development publishable key required');
  const issuer = new URL(values.CLERK_JWT_ISSUER_DOMAIN);
  assert.ok(issuer.protocol === 'https:' && issuer.origin === values.CLERK_JWT_ISSUER_DOMAIN, 'Exact HTTPS issuer required');
  const frontendDomain = Buffer.from(values.VITE_CLERK_PUBLISHABLE_KEY.slice('pk_test_'.length), 'base64').toString('utf8').replace(/\$$/, '');
  assert.equal(frontendDomain, issuer.hostname, 'Clerk publishable key and issuer must identify the same instance');
  const parties = values.CLERK_AUTHORIZED_PARTIES.split(',').map(value => value.trim());
  assert.deepEqual(parties, [origin], 'Development authorized party must be exactly the isolated frontend origin');
  return Object.fromEntries([...required, 'CLERK_JWT_KEY'].map(name => [name, values[name] || '']));
}

function validateTarget(uri, dbName, replicaName) {
  const target = new URL(uri);
  assert.equal(target.protocol, 'mongodb:');
  assert.equal(target.hostname, '127.0.0.1');
  assert.ok(target.port && target.port !== '27017' && target.port !== '27027');
  assert.equal(target.pathname, `/${dbName}`);
  assert.match(dbName, /^htg_clerk_dev_[a-f0-9]{16}$/);
  assert.equal(target.searchParams.get('replicaSet'), replicaName);
  assert.equal(target.username, '');
  return target;
}

async function main(args = process.argv.slice(2)) {
  assert.ok(args[0] === '--check-db' || args[0] === '--start', 'Use --check-db or --start [explicit env file paths]');
  const files = args.slice(1).filter(value => value !== '--configured-frontend');
  const settings = args[0] === '--start' ? credentials(files) : null;
  const frontendProvider = args.includes('--configured-frontend')
    ? Object.assign({}, ...files.map(file => dotenv.parse(fs.readFileSync(path.resolve(file))))).VITE_AUTH_PROVIDER || 'jwt'
    : 'clerk';
  assert.ok(['jwt', 'clerk'].includes(frontendProvider), 'Configured frontend provider is unsupported');
  if (!process.env.MONGOMS_SYSTEM_BINARY && process.platform === 'win32') {
    const root = path.join(process.env.ProgramFiles || 'C:/Program Files', 'MongoDB/Server');
    if (fs.existsSync(root)) for (const version of fs.readdirSync(root).sort().reverse()) {
      const binary = path.join(root, version, 'bin/mongod.exe');
      if (fs.existsSync(binary)) { process.env.MONGOMS_SYSTEM_BINARY = binary; break; }
    }
  }
  if (process.env.MONGOMS_SYSTEM_BINARY) process.env.MONGOMS_SYSTEM_BINARY_VERSION_CHECK = 'false';
  const runRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'htg-clerk-dev-'));
  const dbPath = path.join(runRoot, 'mongo');
  fs.mkdirSync(dbPath);
  const dbName = `htg_clerk_dev_${crypto.randomBytes(8).toString('hex')}`;
  const replicaName = dbName;
  let replica, client, mongoose, api, frontend;
  const runtimeFile = path.join(projectRoot, 'verification/runtime.local');
  let closed = false;
  const cleanup = async () => {
    if (closed) return;
    closed = true;
    if (frontend) await frontend.close();
    if (api) await new Promise(resolve => api.close(resolve));
    if (mongoose) await mongoose.disconnect();
    if (client) await client.close();
    if (replica) await replica.stop();
    if (fs.existsSync(runtimeFile) && JSON.parse(fs.readFileSync(runtimeFile)).database === dbName) fs.unlinkSync(runtimeFile);
    process.stdin.pause();
    if (process.connected) process.disconnect();
    console.log('Isolated runtime stopped; live services and configuration were not changed.');
  };
  try {
    replica = await MongoMemoryReplSet.create({ instanceOpts: [{ dbPath, dbName, ip: '127.0.0.1' }],
      replSet: { name: replicaName, count: 1, ip: '127.0.0.1', storageEngine: 'wiredTiger' } });
    const uri = replica.getUri(dbName);
    const target = validateTarget(uri, dbName, replicaName);
    // Verify the process we just created owns precisely this data path and socket.
    const instance = replica.servers[0].instanceInfo;
    assert.equal(instance.port, Number(target.port));
    assert.equal(path.resolve(instance.dbPath), path.resolve(dbPath));
    assert.ok(instance.instance.mongodProcess.pid > 0);
    client = new MongoClient(uri);
    await client.connect();
    const hello = await client.db(dbName).admin().command({ hello: 1 });
    assert.equal(hello.setName, replicaName);
    assert.equal(hello.isWritablePrimary, true);
    const options = await client.db(dbName).admin().command({ getCmdLineOpts: 1 });
    assert.equal(path.resolve(options.parsed.storage.dbPath), path.resolve(dbPath));
    assert.equal(options.parsed.net.bindIp, '127.0.0.1');
    const session = client.startSession();
    try {
      session.startTransaction();
      await client.db(dbName).collection('isolation_probe').insertOne({ probe: true }, { session });
      await session.abortTransaction();
    } finally { await session.endSession(); }
    assert.equal(await client.db(dbName).collection('isolation_probe').countDocuments(), 0);
    console.log(JSON.stringify({ isolationVerified: true, database: dbName, replicaSet: replicaName,
      loopbackOnly: true, separateProcess: true, separateTemporaryDataPath: true,
      transactionsVerifiedByAbort: true, configuredMongoUriUsed: false }));
    if (args[0] === '--check-db') return;
    // All checks above must pass BEFORE importing application models/config or starting HTTP.
    process.chdir(runRoot); // dotenv.config() cannot read the repository's live .env.
    Object.assign(process.env, settings, { NODE_ENV: 'development', AUTH_PROVIDER: 'clerk',
      VITE_AUTH_PROVIDER: frontendProvider, MONGODB_URI: uri, PORT: '5101', API_PREFIX: '/api/v1',
      CLIENT_URL: origin, CORS_ORIGIN: origin, VITE_API_BASE_URL: `${apiOrigin}/api/v1`,
      QR_SECRET_SALT: crypto.randomBytes(32).toString('hex'), LOG_LEVEL: 'error' });
    mongoose = require('mongoose');
    await mongoose.connect(uri, { autoIndex: true });
    assert.equal(mongoose.connection.name, dbName);
    // Some admin GET handlers auto-create a default event. Enforce the user's
    // no-event-change rule even if those pages are visited during verification.
    await mongoose.connection.db.createCollection('eventconfigs',
      { validator: { $expr: { $eq: [1, 0] } }, validationLevel: 'strict', validationAction: 'error' });
    const models = require('../src/models');
    assert.equal(models.EventConfig.collection.collectionName, 'eventconfigs');
    for (const model of Object.values(models)) await model.init();
    // No users, mappings, teams, or event configuration are created by this launcher.
    api = require('../src/server').listen(5101, '127.0.0.1');
    await new Promise((resolve, reject) => { api.once('listening', resolve); api.once('error', reject); });
    const { createServer } = await import('vite');
    // CSS tools resolve project-relative config from cwd; backend config is already cached.
    process.chdir(path.join(projectRoot, 'client'));
    frontend = await createServer({ root: path.join(projectRoot, 'client'), envDir: runRoot,
      cacheDir: path.join(runRoot, 'vite-cache'),
      server: { host: '127.0.0.1', port: 5175, strictPort: true,
        proxy: { '/api': { target: apiOrigin, changeOrigin: true } } } });
    await frontend.listen();
    fs.writeFileSync(runtimeFile, JSON.stringify({ uri, database: dbName, replicaSet: replicaName, dataPath: dbPath }), { flag: 'wx' });
    console.log(`Isolated Clerk frontend: ${origin}; API: ${apiOrigin}. No event configuration initialized.`);
    await new Promise(resolve => {
      process.once('SIGINT', resolve); process.once('SIGTERM', resolve);
      if (process.send) process.on('message', message => { if (message === 'stop') resolve(); });
      process.stdin.setEncoding('utf8');
      process.stdin.on('data', value => { if (value.trim() === 'stop') { process.stdin.pause(); resolve(); } });
    });
  } finally { await cleanup(); }
}

if (require.main === module) main().catch(error => {
  // Configuration/connection errors may embed values: never echo arbitrary messages.
  if (error.message?.startsWith('Missing configuration:')) console.error(error.message);
  else console.error('Isolated Clerk verification refused or failed. No live target was selected.');
  process.exitCode = 1;
});
module.exports = { credentials, validateTarget, main };
