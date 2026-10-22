// Explicit opt-in real development smoke test. No live database URI is accepted.
const fs = require('node:fs');
const path = require('node:path');
const { fork } = require('node:child_process');
const { chromium } = require('playwright');
const { MongoClient } = require('mongodb');
const { validateTarget } = require('../server/scripts/clerk-development');
const { createClerkClient, verifyToken } = require('@clerk/backend');
const dotenv = require('dotenv');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const runtimeFile = path.join(__dirname, 'runtime.local');
async function main() {
  // A descriptor from an interrupted prior run is discarded only after a guarded
  // connection attempt proves its owned loopback socket is no longer listening.
  if (fs.existsSync(runtimeFile)) {
    const old = JSON.parse(fs.readFileSync(runtimeFile));
    validateTarget(old.uri, old.database, old.replicaSet);
    const probe = new MongoClient(old.uri, { serverSelectionTimeoutMS: 1000 });
    let active = false;
    try { await probe.connect(); active = true; } catch { /* no listener */ }
    finally { await probe.close(); }
    if (active) throw new Error('An isolated runtime is already active; do not replace it');
    fs.unlinkSync(runtimeFile);
  }
  const child = fork(path.join(root, 'server/scripts/clerk-development.js'),
    ['--start', path.join(root, 'server/.env'), path.join(root, 'client/.env'), '--configured-frontend'],
    { cwd: root, silent: true });
  let browser, mongo, currentPage;
  const settings = dotenv.parse(fs.readFileSync(path.join(root, 'server/.env')));
  const clerk = createClerkClient({ secretKey: settings.CLERK_SECRET_KEY });
  const createdIds = [];
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Isolated runtime startup timeout')), 90000);
      child.stdout.on('data', data => {
        const output = data.toString();
        if (output.includes('isolationVerified')) console.log(output.trim());
        if (output.includes('Isolated Clerk frontend:')) { clearTimeout(timer); resolve(); }
      });
      child.once('exit', () => { clearTimeout(timer); reject(new Error('Runtime stopped before ready')); });
      child.stderr.on('data', () => {}); // Do not forward arbitrary secret-bearing dependency errors.
    });
    browser = await chromium.launch({ channel: 'chrome', headless: true });
    const page = await browser.newPage();
    currentPage = page;
    page.setDefaultNavigationTimeout(90000);
    console.log(JSON.stringify({ stage: 'isolated-runtime-and-browser-ready', passed: true }));
    const testing = await clerk.testingTokens.createTestingToken();
    console.log(JSON.stringify({ stage: 'real-testing-token-issued', passed: true }));
    const frontendSettings = dotenv.parse(fs.readFileSync(path.join(root, 'client/.env')));
    const domain = Buffer.from(frontendSettings.VITE_CLERK_PUBLISHABLE_KEY.slice('pk_test_'.length), 'base64').toString().replace(/\$$/, '');
    page.on('response', async response => {
      try {
        if (new URL(response.url()).hostname === domain && response.status() >= 400) {
          const data = await response.json();
          console.log(JSON.stringify({ stage: 'real-clerk-api-error', status: response.status(), codes: data.errors?.map(error => error.code) || [] }));
        }
      } catch { /* Non-JSON static resources never contain test evidence. */ }
    });
    await page.route(`https://${domain}/**`, route => {
      const url = new URL(route.request().url());
      if (url.pathname.startsWith('/v1/')) url.searchParams.set('__clerk_testing_token', testing.token);
      return route.continue({ url: url.toString() }); // Real request; no responses are mocked.
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message.replace(/(?:pk|sk)_(?:test|live)_[A-Za-z0-9=]+/g, '[KEY]')));
    await page.goto('http://127.0.0.1:5175/login', { waitUntil: 'domcontentloaded' });
    await page.locator('input[name="identifier"]').waitFor({ timeout: 60000 });
    console.log(JSON.stringify({ stage: 'login-ui', body: (await page.locator('body').innerText()).slice(0, 1500),
      inputs: await page.locator('input').evaluateAll(xs => xs.map(x => ({ name: x.name, type: x.type }))), errors }));
    await page.screenshot({ path: path.join(root, 'docs/reports/clerk-login-development.png'), fullPage: true });
    const suffix = crypto.randomBytes(8).toString('hex');
    const email = `htgverify${suffix}+clerk_test@example.com`;
    const password = crypto.randomBytes(24).toString('hex');
    let identity;
    if (process.argv.includes('--api-fixture')) {
      identity = await clerk.users.createUser({ emailAddress: [email], username: `htg${suffix}`, phoneNumber: [`+120255501${crypto.randomInt(0,100).toString().padStart(2,'0')}`], password });
      createdIds.push(identity.id);
      console.log(JSON.stringify({ stage: 'development-only-backend-fixture-created', passed: true }));
    } else {
    await page.goto('http://127.0.0.1:5175/register', { waitUntil: 'domcontentloaded' });
    await page.locator('input').first().waitFor({ timeout: 30000 });
    console.log(JSON.stringify({ stage: 'registration-fields', inputs: await page.locator('input').evaluateAll(xs => xs.map(x => ({ name: x.name, type: x.type, autoComplete: x.autocomplete }))) }));
    for (const field of await page.locator('input').all()) {
      const name = (await field.getAttribute('name') || '').toLowerCase();
      if (name.includes('email')) await field.fill(email);
      else if (name.includes('password')) await field.fill(password);
      else if (name.includes('username')) await field.fill(`htg${suffix}`);
      else if (name.includes('firstname')) await field.fill('Synthetic');
      else if (name.includes('lastname')) await field.fill('Verification');
      else if (name.includes('phone')) await field.fill(`+120255501${crypto.randomInt(0, 100).toString().padStart(2, '0')}`);
    }
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.waitForFunction(() => !!window.Clerk?.session || /Verify your (email|phone)/i.test(document.body.innerText), null, { timeout: 45000 });
    let submittedVerification;
    const verificationDeadline = Date.now() + 90000;
    while (Date.now() < verificationDeadline && !await page.evaluate(() => !!window.Clerk?.session)) {
      const text = await page.locator('body').innerText();
      const step = /Verify your (email|phone)/i.exec(text)?.[1].toLowerCase();
      if (step && step !== submittedVerification) {
        const otp = page.locator('input[autocomplete="one-time-code"], input[name="code"], input[type="text"]');
        await otp.first().fill('424242');
        const verify = page.getByRole('button', { name: /^(verify|verify email|verify phone|continue)$/i });
        if (await verify.count() && await verify.first().isEnabled()) await verify.first().click();
        submittedVerification = step;
        console.log(JSON.stringify({ stage: `real-${step}-verification-submitted` }));
      }
      await page.waitForTimeout(1000);
    }
    console.log(JSON.stringify({ stage: 'registration-progress', body: (await page.locator('body').innerText()).replaceAll(email, '[synthetic email]').slice(0, 1200) }));
    await page.waitForFunction(() => !!window.Clerk?.session, null, { timeout: 25000 });
    identity = { id: await page.evaluate(() => window.Clerk.user.id) };
    createdIds.push(identity.id);
    console.log(JSON.stringify({ stage: 'real-clerk-sign-up', passed: true }));
    await page.evaluate(() => window.Clerk.signOut({ redirectUrl: '/login' }));
    await page.waitForURL('**/login');
    }
    if (process.argv.includes('--sdk-password')) {
      const result = await page.evaluate(async ({ email, password }) => {
        let attempt = await window.Clerk.client.signIn.create({ strategy: 'password', identifier: email, password });
        if (['needs_second_factor', 'needs_client_trust'].includes(attempt.status)) {
          const factor = attempt.supportedSecondFactors.find(factor => factor.strategy === 'email_code');
          if (!factor) return { status: attempt.status };
          await attempt.prepareSecondFactor({ strategy: 'email_code', emailAddressId: factor.emailAddressId });
          attempt = await attempt.attemptSecondFactor({ strategy: 'email_code', code: '424242' });
        }
        if (attempt.status === 'complete') await window.Clerk.setActive({ session: attempt.createdSessionId });
        return { status: attempt.status };
      }, { email, password });
      console.log(JSON.stringify({ stage: 'real-browser-sdk-password-result', ...result }));
      assert.equal(result.status, 'complete');
    } else {
    await page.locator('input[name="identifier"]').fill(email);
    if (!await page.locator('input[name="password"]').count()) await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole('button', { name: 'Continue', exact: true }).click();
    await page.waitForFunction(() => !!window.Clerk?.session || /Check your email|Verify your (email|phone)/i.test(document.body.innerText), null, { timeout: 45000 });
    if (!await page.evaluate(() => !!window.Clerk?.session)) {
      await page.locator('input[type="text"]').first().fill('424242');
      console.log(JSON.stringify({ stage: 'new-device-code-entered', inputLength: await page.locator('input[type="text"]').first().inputValue().then(value => value.length) }));
      const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
      if (await continueButton.count() && await continueButton.isEnabled()) await continueButton.click();
    }
    await page.waitForFunction(() => !!window.Clerk?.session, null, { timeout: 25000 });
    }
    await page.waitForURL('**/auth/complete', { timeout: 20000 });
    console.log(JSON.stringify({ stage: 'real-password-sign-in', passed: true }));
    const tokenClock = await page.evaluate(async () => {
      const token = await window.Clerk.session.getToken();
      const claims = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return { issuedAtOffsetMs: claims.iat * 1000 - Date.now(), expiresInMs: claims.exp * 1000 - Date.now() };
    });
    console.log(JSON.stringify({ stage: 'real-session-clock-check', ...tokenClock }));
    if (tokenClock.issuedAtOffsetMs > 5000) {
      assert.ok(tokenClock.issuedAtOffsetMs < 30000, 'Clock drift too large for bounded verification wait');
      console.log(JSON.stringify({ stage: 'clock-sync-required', passed: false, verificationWaitOnly: true }));
      await page.waitForTimeout(tokenClock.issuedAtOffsetMs + 1000);
    }
    const capturedSessionToken = await page.evaluate(() => window.Clerk.session.getToken());
    const api = async route => page.evaluate(async ({route, token}) => {
      const response = await fetch(`http://127.0.0.1:5101/api/v1${route}`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json();
      return { status: response.status, errorCode: body.errorCode, role: body.data?.user?.role, message: body.message };
    }, {route, token: capturedSessionToken});
    const unlinked = await api('/auth/me');
    console.log(JSON.stringify({ stage: 'real-unlinked-api-result', ...unlinked }));
    if (unlinked.status !== 403) {
      try {
        const actualToken = await page.evaluate(() => window.Clerk.session.getToken());
        const claims = await verifyToken(actualToken, { secretKey: settings.CLERK_SECRET_KEY,
          issuer: `https://${domain}`, authorizedParties: ['http://127.0.0.1:5175'] });
        const session = await clerk.sessions.getSession(claims.sid);
        console.log(JSON.stringify({ stage: 'session-diagnostic', signatureValid: true, active: session.status === 'active',
          ownerMatches: session.userId === claims.sub, expirationType: typeof session.expireAt, expiresInFuture: session.expireAt > Date.now() }));
      } catch (error) { console.log(JSON.stringify({ stage: 'session-diagnostic', failureType: error.name, reason: error.reason || null })); }
    }
    assert.equal(unlinked.status, 403); assert.equal(unlinked.errorCode, 'CLERK_ACCOUNT_UNLINKED');
    console.log(JSON.stringify({ stage: 'real-unlinked-rejection', passed: true }));
    const registrationStatus = await page.evaluate(async token => {
      const response = await fetch('http://127.0.0.1:5101/api/v1/auth/clerk/register', {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'closed_registration_fixture', fullName: 'Synthetic Verification' })
      });
      return response.status;
    }, capturedSessionToken);
    assert.equal(registrationStatus, 403);
    console.log(JSON.stringify({ stage: 'real-application-registration-remains-closed', passed: true }));
    const runtime = JSON.parse(fs.readFileSync(runtimeFile));
    validateTarget(runtime.uri, runtime.database, runtime.replicaSet);
    mongo = new MongoClient(runtime.uri); await mongo.connect();
    const hello = await mongo.db(runtime.database).admin().command({ hello: 1 });
    assert.equal(hello.setName, runtime.replicaSet);
    const opts = await mongo.db(runtime.database).admin().command({ getCmdLineOpts: 1 });
    assert.equal(path.resolve(opts.parsed.storage.dbPath), path.resolve(runtime.dataPath));
    const db = mongo.db(runtime.database);
    assert.equal(await db.collection('users').countDocuments(), 0);
    await db.collection('users').insertOne({ username: `fixture_${suffix}`, fullName: 'Synthetic Verification',
      email, clerkUserId: identity.id, role: 'TEAM_MEMBER', teamId: null, isActive: true,
      securityRevision: 0, tokenVersion: 0, createdAt: new Date(), updatedAt: new Date() });
    assert.equal((await api('/auth/me')).status, 200);
    assert.equal((await api('/admin/teams')).status, 403);
    await db.collection('users').updateOne({ clerkUserId: identity.id }, { $set: { isActive: false } });
    assert.equal((await api('/auth/me')).errorCode, 'ACCOUNT_INACTIVE');
    await db.collection('users').updateOne({ clerkUserId: identity.id }, { $set: { isActive: true, role: 'ADMIN' } });
    assert.equal((await api('/admin/teams')).status, 200);
    await db.collection('users').updateOne({ clerkUserId: identity.id }, { $set: { role: 'TEAM_MEMBER' } });
    console.log(JSON.stringify({ stage: 'real-mapping-inactive-and-db-authorization', passed: true, syntheticIsolatedRecordOnly: true }));
    await page.goto('http://127.0.0.1:5175/portal/dashboard');
    await page.waitForFunction(() => window.Clerk?.session);
    await page.waitForTimeout(12000);
    if (new URL(page.url()).pathname === '/auth/complete' && await page.getByRole('button', {name: 'Retry verification'}).count()) {
      await page.getByRole('button', {name: 'Retry verification'}).click();
    }
    await page.waitForURL('**/portal/dashboard', {timeout: 20000});
    assert.equal(new URL(page.url()).pathname, '/portal/dashboard');
    const tokenBeforeLogout = capturedSessionToken;
    // Remove only the synthetic mapping to expose the app's own sign-out control.
    await db.collection('users').deleteOne({ clerkUserId: identity.id });
    await page.goto('http://127.0.0.1:5175/auth/complete');
    await page.getByRole('button', { name: 'Sign out', exact: true }).click();
    await page.waitForURL('**/login', { timeout: 20000 });
    assert.ok(JSON.parse(Buffer.from(tokenBeforeLogout.split('.')[1], 'base64url')).exp * 1000 > Date.now(), 'Revocation check must use an unexpired token');
    const revoked = await fetch('http://127.0.0.1:5101/api/v1/auth/me', { headers: { Authorization: `Bearer ${tokenBeforeLogout}` } });
    assert.equal(revoked.status, 401);
    await page.goto('http://127.0.0.1:5175/portal/dashboard');
    await page.waitForURL('**/login', { timeout: 20000 });
    console.log(JSON.stringify({ stage: 'real-app-logout-and-protected-route', passed: true, priorTokenRejected: true }));
    assert.equal(await db.collection('eventconfigs').countDocuments(), 0);
    assert.equal(await db.collection('scores').countDocuments(), 0);
    console.log(JSON.stringify({ stage: 'no-event-or-historical-writes', passed: true }));
  } catch (error) {
    if (currentPage && !currentPage.isClosed()) {
      console.log(JSON.stringify({ stage: 'failure-screen', path: new URL(currentPage.url()).pathname,
        body: (await currentPage.locator('body').innerText()).replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/g, '[email]').slice(0, 1600),
        inputs: await currentPage.locator('input').evaluateAll(xs => xs.map(x => ({ name: x.name, type: x.type }))) }));
    }
    throw error;
  } finally {
    for (const id of createdIds) {
      try { await clerk.users.deleteUser(id); console.log(JSON.stringify({ stage: 'test-identity-cleanup', deleted: true })); }
      catch { console.error('Development test identity cleanup failed; private organizer follow-up required.'); }
    }
    await mongo?.close();
    await browser?.close();
    child.send('stop');
    await new Promise(resolve => { if (child.exitCode !== null) resolve(); else child.once('exit', resolve); });
  }
}
main().catch(error => {
  console.error(JSON.stringify({ verificationFailed: true, errorType: error.name, status: error.status || null,
    codes: error.errors?.map(item => item.code).filter(code => /^[a-z_]+$/.test(code)) || [] }));
  process.exitCode = 1;
});
