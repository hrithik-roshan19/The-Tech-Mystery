// Unit tests for Vercel Clerk Frontend API Serverless Proxy handler (api/__clerk.js)
const { it, describe, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

describe('Clerk Vercel Proxy Handler (api/__clerk.js)', () => {
  let proxyHandler;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = global.fetch;
    process.env.CLERK_SECRET_KEY = 'sk_test_fixture_secret_key';
    process.env.CLERK_PROXY_URL = 'https://the-tech-mystery.vercel.app/.__clerk';
    // Import the ES module handler with file:// URL for Windows compatibility
    const fileUrl = pathToFileURL(path.resolve(__dirname, '../../api/__clerk.js')).href;
    const mod = await import(fileUrl);
    proxyHandler = mod.default;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_PROXY_URL;
  });

  function createMockResponse() {
    const res = {
      statusCode: 200,
      headers: {},
      ended: false,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      setHeader(key, val) {
        this.headers[key.toLowerCase()] = val;
        return this;
      },
      send(data) {
        this.body = data;
        this.ended = true;
        return this;
      },
      json(data) {
        this.headers['content-type'] = 'application/json';
        this.body = JSON.stringify(data);
        this.ended = true;
        return this;
      },
      end() {
        this.ended = true;
        return this;
      }
    };
    return res;
  }

  it('handles CORS OPTIONS preflight request with 204 No Content', async () => {
    const req = {
      method: 'OPTIONS',
      headers: {
        origin: 'https://the-tech-mystery.vercel.app'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 204);
    assert.equal(res.headers['access-control-allow-origin'], 'https://the-tech-mystery.vercel.app');
    assert.equal(res.headers['access-control-allow-credentials'], 'true');
    assert.ok(res.headers['access-control-allow-methods'].includes('POST'));
    assert.ok(res.headers['access-control-allow-headers'].includes('Clerk-Proxy-Url'));
  });

  it('proxies GET request to frontend-api.clerk.dev with required headers and query parameters', async () => {
    let capturedUrl;
    let capturedOptions;

    global.fetch = mock.fn(async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return new Response('console.log("clerk-js");', {
        status: 200,
        headers: {
          'content-type': 'application/javascript; charset=utf-8',
          'cache-control': 'public, max-age=3600'
        }
      });
    });

    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'x-forwarded-proto': 'https',
        'x-forwarded-for': '203.0.113.195',
        'user-agent': 'Mozilla/5.0 Test'
      },
      query: {
        path: 'npm/@clerk/clerk-js@6/dist/clerk.browser.js',
        version: '6.40.0'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(capturedUrl, 'https://frontend-api.clerk.dev/npm/@clerk/clerk-js@6/dist/clerk.browser.js?version=6.40.0');
    assert.equal(capturedOptions.method, 'GET');
    assert.equal(capturedOptions.headers['Host'], 'frontend-api.clerk.dev');
    assert.equal(capturedOptions.headers['Clerk-Proxy-Url'], 'https://the-tech-mystery.vercel.app/.__clerk');
    assert.equal(capturedOptions.headers['Clerk-Secret-Key'], 'sk_test_fixture_secret_key');
    assert.equal(capturedOptions.headers['X-Forwarded-For'], '203.0.113.195');
    assert.equal(capturedOptions.headers['X-Forwarded-Host'], 'the-tech-mystery.vercel.app');

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
    assert.equal(res.body.toString('utf8'), 'console.log("clerk-js");');
  });

  it('rewrites redirect location headers targeting frontend-api.clerk.dev to proxy path', async () => {
    global.fetch = mock.fn(async () => {
      return new Response(null, {
        status: 307,
        headers: {
          location: 'https://frontend-api.clerk.dev/npm/@clerk/clerk-js@6.40.0/dist/clerk.browser.js'
        }
      });
    });

    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'x-forwarded-proto': 'https',
        'x-matched-path': '/.__clerk/npm/@clerk/clerk-js@6/dist/clerk.browser.js'
      },
      query: {
        path: 'npm/@clerk/clerk-js@6/dist/clerk.browser.js'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 307);
    assert.equal(res.headers['location'], '/.__clerk/npm/@clerk/clerk-js@6.40.0/dist/clerk.browser.js');
  });

  it('forwards POST request payloads and passes back Set-Cookie headers', async () => {
    let capturedBody;

    global.fetch = mock.fn(async (url, options) => {
      capturedBody = options.body;
      return new Response(JSON.stringify({ response: { status: 'complete' } }), {
        status: 200,
        headers: {
          'content-type': 'application/json',
          'set-cookie': '__session=session_token_123; Path=/; HttpOnly; Secure'
        }
      });
    });

    const req = {
      method: 'POST',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'content-type': 'application/json'
      },
      query: {
        path: 'v1/client/sign_ins'
      },
      body: {
        identifier: 'operative@test.com',
        strategy: 'password'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(capturedBody.toString('utf8')), {
      identifier: 'operative@test.com',
      strategy: 'password'
    });
    assert.ok(res.headers['set-cookie']);
  });

  it('returns 502 with structured error when upstream Clerk FAPI fails', async () => {
    global.fetch = mock.fn(async () => {
      throw new Error('Connection refused by remote host');
    });

    const req = {
      method: 'GET',
      headers: { host: 'the-tech-mystery.vercel.app' },
      query: { path: 'v1/client' }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 502);
    const body = JSON.parse(res.body);
    assert.equal(body.error, 'clerk_proxy_error');
    assert.ok(body.message.includes('Connection refused'));
  });
});
