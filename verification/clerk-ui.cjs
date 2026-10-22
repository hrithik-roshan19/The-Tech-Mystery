// Signed-out UI inspection using the saved client provider, with a proven new DB.
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
async function main() {
  if (fs.existsSync(path.join(__dirname, 'runtime.local'))) throw new Error('Stop the existing isolated runtime first');
  const expected = process.argv.includes('--legacy') ? 'legacy' : 'clerk';
  const child = fork(path.join(root, 'server/scripts/clerk-development.js'),
    ['--start', path.join(root, 'server/.env'), path.join(root, 'client/.env'), '--configured-frontend'],
    { cwd: root, silent: true });
  let browser;
  const results = [];
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Isolated startup timed out')), 90000);
      child.stdout.on('data', data => {
        if (data.toString().includes('isolationVerified')) console.log(data.toString().trim());
        if (data.toString().includes('Isolated Clerk frontend:')) { clearTimeout(timer); resolve(); }
      });
      child.stderr.on('data', () => {});
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Isolated startup failed')); });
    });
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(90000);
    let pageErrors = 0, consoleErrors = 0, failedRequests = 0;
    const httpFailures = [];
    page.on('pageerror', () => pageErrors++);
    page.on('console', event => { if (event.type() === 'error') consoleErrors++; });
    page.on('requestfailed', () => failedRequests++);
    page.on('response', response => { if (response.status() >= 400) httpFailures.push(response.status()); });
    for (const route of ['/login', '/register', '/admin/login']) {
      await page.goto(`http://127.0.0.1:5175${route}`, { waitUntil: 'domcontentloaded' });
      if (expected === 'clerk') {
        await page.locator(route === '/register' ? 'input[name="emailAddress"]' : 'input[name="identifier"]').waitFor({ timeout: 60000 });
      } else await page.locator('input').first().waitFor({ timeout: 30000 });
      const text = await page.locator('body').innerText();
      const clerkVisible = route === '/register'
        ? /Create your account/i.test(text) && await page.locator('input[name="emailAddress"]').count() > 0
        : /Sign in to/i.test(text) && await page.locator('input[name="identifier"]').count() > 0;
      const legacyVisible = /Welcome Back|Team Details|Team Leader/.test(text) && !clerkVisible;
      const result = { route, clerkVisible, legacyVisible, blank: !text.trim(), loading: /^Verifying account/.test(text.trim()) };
      results.push(result); console.log(JSON.stringify(result));
      await page.screenshot({ path: path.join(root, `docs/reports/clerk-ui-${expected}-${route.replaceAll('/', '-').slice(1)}.png`), fullPage: true });
      assert.ok(expected === 'clerk' ? clerkVisible : legacyVisible);
    }
    await page.goto('http://127.0.0.1:5175/portal/dashboard', { waitUntil: 'domcontentloaded' });
    await page.waitForURL('**/login', { timeout: 30000 });
    const evidence = { expected, results, signedOutProtectedRedirectPassed: true, pageErrors, consoleErrors, failedRequests, httpFailures };
    fs.writeFileSync(path.join(root, `docs/reports/clerk-ui-${expected}.json`), JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence));
    assert.equal(pageErrors, 0);
  } finally {
    await browser?.close();
    if (child.connected) child.send('stop');
    await new Promise(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', resolve); });
  }
}
main().catch(error => { console.error(JSON.stringify({ uiVerificationFailed: true, type: error.name })); process.exitCode = 1; });
