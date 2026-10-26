const { it, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const express = require('express');
const rateLimit = require('express-rate-limit');

describe('Proxy Trust & Rate Limiting Architecture Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    const app = express();
    app.set('trust proxy', 1); // Single hop behind Render reverse proxy

    // Standard rate limiter with DEFAULT validation enabled (no validate: { trustProxy: false })
    const testLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 2,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => res.status(429).json({ success: false, message: 'Too many requests' })
    });

    app.get('/test-ip', (req, res) => {
      res.json({ ip: req.ip, ips: req.ips });
    });

    app.get('/test-spoof', (req, res) => {
      res.json({ ip: req.ip });
    });

    app.get('/test-limit', testLimiter, (req, res) => {
      res.json({ success: true, ip: req.ip });
    });

    app.get('/test-auth', (req, res) => {
      res.status(403).json({ success: false, message: 'Forbidden: Requires ADMIN role', errorCode: 'FORBIDDEN' });
    });

    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('1. Express with trust proxy: 1 extracts real client IP from rightmost hop in X-Forwarded-For', async () => {
    const res = await fetch(`${baseUrl}/test-ip`, {
      headers: { 'X-Forwarded-For': '203.0.113.195' }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ip, '203.0.113.195');
  });

  it('2. Express with trust proxy: 1 prevents IP spoofing on multi-hop chains', async () => {
    // Attacker sends spoofed header: "1.1.1.1, 203.0.113.195" where 203.0.113.195 was appended by Render
    const res = await fetch(`${baseUrl}/test-spoof`, {
      headers: { 'X-Forwarded-For': '1.1.1.1, 203.0.113.195' }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    // Express trusts only 1 hop, so the real client is 203.0.113.195, NOT the spoofed 1.1.1.1
    assert.equal(body.ip, '203.0.113.195');
  });

  it('3. Direct requests without X-Forwarded-For resolve directly to the socket remote address', async () => {
    const res = await fetch(`${baseUrl}/test-ip`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.ip === '127.0.0.1' || body.ip === '::ffff:127.0.0.1');
  });

  it('4. Rate limiters operate cleanly with default validation enabled behind single-hop proxy', async () => {
    // Request 1 from Client A
    const res1 = await fetch(`${baseUrl}/test-limit`, {
      headers: { 'X-Forwarded-For': '198.51.100.1' }
    });
    assert.equal(res1.status, 200);

    // Request 2 from Client A
    const res2 = await fetch(`${baseUrl}/test-limit`, {
      headers: { 'X-Forwarded-For': '198.51.100.1' }
    });
    assert.equal(res2.status, 200);

    // Request 3 from Client A -> Rate limited (429)
    const res3 = await fetch(`${baseUrl}/test-limit`, {
      headers: { 'X-Forwarded-For': '198.51.100.1' }
    });
    assert.equal(res3.status, 429);
    const body3 = await res3.json();
    assert.equal(body3.message, 'Too many requests');

    // Request from Client B -> Not limited (isolated by real client IP)
    const resClientB = await fetch(`${baseUrl}/test-limit`, {
      headers: { 'X-Forwarded-For': '198.51.100.2' }
    });
    assert.equal(resClientB.status, 200);
  });

  it('5. express-rate-limit preserves security validation when trust proxy is misconfigured', async () => {
    // Create an app without trust proxy set (false default)
    const unconfiguredApp = express();
    let caughtValidationError = null;

    const strictLimiter = rateLimit({
      windowMs: 60 * 1000,
      max: 10,
      // validation enabled by default
    });

    unconfiguredApp.use(strictLimiter);
    unconfiguredApp.get('/probe', (req, res) => res.send('ok'));

    const unconfiguredServer = http.createServer(unconfiguredApp);
    await new Promise((resolve) => unconfiguredServer.listen(0, '127.0.0.1', resolve));
    const unconfiguredPort = unconfiguredServer.address().port;

    // Capture console.error or uncaught error from express-rate-limit validation
    const origError = console.error;
    console.error = (err) => {
      if (err && (err.code === 'ERR_ERL_UNEXPECTED_X_FORWARDED_FOR' || String(err).includes('X-Forwarded-For'))) {
        caughtValidationError = err;
      }
    };

    try {
      // Send X-Forwarded-For to an unconfigured app
      await fetch(`http://127.0.0.1:${unconfiguredPort}/probe`, {
        headers: { 'X-Forwarded-For': '1.2.3.4' }
      });
      // The validator fired and logged the error
      assert.ok(caughtValidationError !== null, 'express-rate-limit validator should catch unexpected X-Forwarded-For');
    } finally {
      console.error = origError;
      await new Promise((resolve) => unconfiguredServer.close(resolve));
    }
  });

  it('6. Architecture clearly distinguishes 429 (Rate Limited) vs 403 (Forbidden / Authorization)', async () => {
    // Rate limit response
    const rLimit = await fetch(`${baseUrl}/test-limit`, {
      headers: { 'X-Forwarded-For': '198.51.100.1' } // Already exhausted in test 4
    });
    assert.equal(rLimit.status, 429);

    // Authorization response
    const rAuth = await fetch(`${baseUrl}/test-auth`);
    assert.equal(rAuth.status, 403);
    const bodyAuth = await rAuth.json();
    assert.equal(bodyAuth.errorCode, 'FORBIDDEN');
    assert.equal(bodyAuth.message, 'Forbidden: Requires ADMIN role');
  });
});
