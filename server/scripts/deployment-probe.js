const fs = require('node:fs');
const path = require('node:path');

async function inspectRunningApi(base) {
  const url = new URL(base);
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || url.username || url.password || url.search || url.hash) {
    throw new Error('This probe accepts only an explicit loopback API URL without credentials');
  }
  const get = async (route, method = 'GET') => fetch(base.replace(/\/$/, '') + route,
    { method, redirect: 'error', signal: AbortSignal.timeout(5000) });
  const health = await get('/health');
  const healthBody = await health.json();
  const leaderboard = await get('/leaderboard');
  const body = await leaderboard.json();
  const logoutOptions = await get('/auth/logout', 'OPTIONS');
  const processStart = typeof healthBody.data?.uptime === 'number' ? Date.now() - healthBody.data.uptime * 1000 : null;
  const workingTreeFiles = ['src/controllers/leaderboard.controller.js', 'src/controllers/auth.controller.js',
    'src/controllers/team.controller.js', 'src/middleware/auth.middleware.js', 'src/services/scoring.service.js',
    'src/services/team.service.js', 'src/services/checkpoint.service.js', 'src/utils/transaction.js'].map(file => {
    const absolute = path.resolve(__dirname, '..', file);
    const stat = fs.statSync(absolute);
    return { file: `server/${file}`, sha256: require('node:crypto').createHash('sha256').update(fs.readFileSync(absolute)).digest('hex'),
      modifiedAt: stat.mtime.toISOString(), modifiedAfterProcessStart: processStart === null ? null : stat.mtimeMs > processStart };
  });
  return { capturedAt: new Date().toISOString(), target: base,
    requests: ['GET /health', 'GET /leaderboard', 'OPTIONS /auth/logout'],
    observed: { healthStatus: health.status, approximateProcessStartedAt: processStart === null ? null : new Date(processStart).toISOString(),
      leaderboardStatus: leaderboard.status,
      leaderboardTeamCount: body.data?.leaderboard?.length ?? null,
      leaderboardContainsJoinCodeField: Boolean(body.data?.leaderboard?.some(team => Object.hasOwn(team, 'joinCode'))),
      leaderboardRowFields: [...new Set((body.data?.leaderboard || []).flatMap(team => Object.keys(team)))].sort(),
      logoutOptionsStatus: logoutOptions.status },
    workingTreeExpected: { leaderboardContainsJoinCodeField: false, logoutOptionsStatus: 204 },
    workingTreeFiles,
    limitations: 'No authenticated or write requests. CORS handles OPTIONS globally, so it does not establish logout-route availability. Observations cannot identify the loaded source revision or establish other runtime behavior.' };
}
async function main() {
  const args = process.argv.slice(2);
  const base = args[args.indexOf('--url') + 1];
  const output = args[args.indexOf('--output') + 1];
  if (!args.includes('--url') || !args.includes('--output') || !base || !output) throw new Error('Explicit URL and output required');
  const report = await inspectRunningApi(base);
  const destination = path.resolve(output);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ reportWritten: true, observed: report.observed }));
}
if (require.main === module) main().catch(() => { console.error('Read-only deployment probe failed.'); process.exitCode = 1; });
module.exports = { inspectRunningApi };
