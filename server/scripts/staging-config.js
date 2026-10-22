const fs = require('node:fs');
const path = require('node:path');

function validateStagingConfig(env) {
  if (env.NODE_ENV !== 'production' || env.PORT !== '5100') throw new Error('Staging must use production validation and isolated API port 5100');
  const uri = new URL(env.MONGODB_URI);
  const password = decodeURIComponent(uri.password);
  const queryKeys = [...uri.searchParams.keys()];
  if (uri.protocol !== 'mongodb:' || uri.hostname !== '127.0.0.1' || uri.port !== '27027' ||
      uri.pathname !== '/hack_the_grid_staging' || uri.searchParams.get('replicaSet') !== 'htg-staging' ||
      uri.searchParams.get('authSource') !== 'hack_the_grid_staging' || uri.searchParams.get('directConnection') !== 'true' ||
      uri.username !== 'htg_staging_app' || password.length < 32 || new Set(password).size < 12 ||
      /<|>|replace|example/i.test(password) || new Set(queryKeys).size !== queryKeys.length ||
      queryKeys.some(key => !['replicaSet', 'authSource', 'directConnection'].includes(key))) {
    throw new Error('Refusing a database target outside the dedicated authenticated staging deployment');
  }
  const keys = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'QR_SECRET_SALT'].map(key => env[key]);
  if (new Set(keys).size !== 3 || keys.some(value => !value || value.length < 32 || new Set(value).size < 12 ||
      /<|>|replace|change|default|secret|example/i.test(value))) throw new Error('Distinct staging-only random signing configuration required');
  return { database: 'hack_the_grid_staging', replicaSet: 'htg-staging', apiPort: 5100 };
}

function main() {
  if (!process.argv.includes('--start-approved-staging')) throw new Error('Explicit approval flag required; preparation does not start services');
  const cwd = path.resolve(__dirname, '../../staging');
  const env = require('dotenv').parse(fs.readFileSync(path.join(cwd, '.env')));
  validateStagingConfig(env);
  // Child cwd ensures dotenv reads staging/.env, not root/.env or server/.env.
  const child = require('node:child_process').spawn(process.execPath, [path.resolve(__dirname, 'staging-api.js')],
    { cwd, env: { ...process.env, ...env, HTG_APPROVED_STAGING_START: 'yes' }, stdio: 'inherit' });
  child.on('exit', code => { process.exitCode = code ?? 1; });
  child.on('error', () => { console.error('Staging API could not start'); process.exitCode = 1; });
}
if (require.main === module) {
  try { main(); } catch { console.error('Staging refused: approval, isolated configuration and private secrets are required.'); process.exitCode = 1; }
}
module.exports = { validateStagingConfig };
