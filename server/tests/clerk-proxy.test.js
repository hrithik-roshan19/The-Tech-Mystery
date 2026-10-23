// Unit tests for Vercel Clerk Frontend API Serverless Proxy handler (api/clerk.js)
const { it, describe, beforeEach, afterEach, mock } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

describe('Clerk Vercel Proxy Handler (api/clerk.js)', () => {
  let proxyHandler;
  let originalFetch;

  beforeEach(async () => {
    originalFetch = global.fetch;
    process.env.CLERK_SECRET_KEY = 'sk_test_fixture_secret_key';
    process.env.CLERK_PROXY_URL = 'https://the-tech-mystery.vercel.app/.__clerk';
    process.env.VITE_CLERK_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsudGhlLXRlY2gtbXlzdGVyeS52ZXJjZWwuYXBwJA';
    // Import the ES module handler with file:// URL for Windows compatibility
    const fileUrl = pathToFileURL(path.resolve(__dirname, '../../api/clerk.js')).href;
    const mod = await import(fileUrl);
    proxyHandler = mod.default;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_PROXY_URL;
    delete process.env.VITE_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_FAPI_URL;
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

  it('returns health check status when invoked without target subpath', async () => {
    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app'
      },
      query: {}
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'clerk-proxy');
    assert.equal(body.target, 'frontend-api.clerk.dev');
    assert.equal(body.proxyUrl, 'https://the-tech-mystery.vercel.app/.__clerk');
    assert.equal(body.hasSecretKey, true);
    assert.equal(body.hasPublishableKey, true);
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
    assert.equal(capturedOptions.headers['Accept-Encoding'], 'identity');

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/javascript; charset=utf-8');
    assert.equal(res.body.toString('utf8'), 'console.log("clerk-js");');
  });

  it('regression: accurately proxies /.__clerk/v1/environment with complete query parameters and headers', async () => {
    let capturedUrl;
    let capturedOptions;

    global.fetch = mock.fn(async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return new Response(JSON.stringify({
        auth_config: { id: 'aac_123', single_session_mode: false }
      }), {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      });
    });

    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'x-forwarded-proto': 'https',
        'x-matched-path': '/.__clerk/v1/environment'
      },
      query: {
        path: 'v1/environment',
        __clerk_api_version: '2024-10-01'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(capturedUrl, 'https://frontend-api.clerk.dev/v1/environment?__clerk_api_version=2024-10-01');
    assert.equal(capturedOptions.headers['Clerk-Secret-Key'], 'sk_test_fixture_secret_key');
    assert.equal(capturedOptions.headers['Clerk-Proxy-Url'], 'https://the-tech-mystery.vercel.app/.__clerk');
    assert.equal(capturedOptions.headers['Host'], 'frontend-api.clerk.dev');

    assert.equal(res.statusCode, 200);
    assert.equal(res.headers['content-type'], 'application/json; charset=utf-8');
    const data = JSON.parse(res.body.toString('utf8'));
    assert.equal(data.auth_config.id, 'aac_123');
  });

  it('regression: accurately proxies /.__clerk/v1/client returning session state and cookies', async () => {
    let capturedUrl;
    let capturedOptions;

    global.fetch = mock.fn(async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return new Response(JSON.stringify({
        response: { id: 'client_abc', sessions: [] }
      }), {
        status: 200,
        headers: {
          'content-type': 'application/json; charset=utf-8',
          'set-cookie': '__client_uat=12345; Path=/; HttpOnly; SameSite=Lax; Secure'
        }
      });
    });

    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'x-forwarded-proto': 'https',
        'x-matched-path': '/.__clerk/v1/client',
        cookie: '__client_uat=0'
      },
      query: {
        path: 'v1/client',
        __clerk_api_version: '2024-10-01'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(capturedUrl, 'https://frontend-api.clerk.dev/v1/client?__clerk_api_version=2024-10-01');
    assert.equal(capturedOptions.headers['cookie'], '__client_uat=0');
    assert.equal(res.statusCode, 200);
    assert.ok(res.headers['set-cookie']);
    const data = JSON.parse(res.body.toString('utf8'));
    assert.equal(data.response.id, 'client_abc');
  });

  it('returns explicit 500 configuration error when secret key is missing for API calls', async () => {
    delete process.env.CLERK_SECRET_KEY;

    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'x-forwarded-proto': 'https'
      },
      query: {
        path: 'v1/environment',
        __clerk_api_version: '2024-10-01'
      }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 500);
    const body = JSON.parse(res.body);
    assert.equal(body.errors[0].code, 'proxy_configuration_error');
    assert.ok(body.errors[0].message.includes('CLERK_SECRET_KEY'));
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

  it('never exposes the secret key in response bodies, headers, or health check', async () => {
    const secretValue = 'sk_test_super_confidential_secret_value_123';
    process.env.CLERK_SECRET_KEY = secretValue;

    global.fetch = mock.fn(async () => {
      return new Response(JSON.stringify({ response: { status: 'ok' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    });

    // 1. Health check response verification
    const healthReq = {
      method: 'GET',
      headers: { host: 'the-tech-mystery.vercel.app' },
      query: { health: '1' }
    };
    const healthRes = createMockResponse();
    await proxyHandler(healthReq, healthRes);

    assert.equal(healthRes.statusCode, 200);
    const healthBodyStr = healthRes.body.toString('utf8');
    assert.equal(healthBodyStr.includes(secretValue), false, 'Health check must never leak the secret key');
    const healthJson = JSON.parse(healthBodyStr);
    assert.equal(healthJson.hasSecretKey, true);
    assert.ok(Array.isArray(healthJson.configuredClerkKeys));

    // 2. Proxied API response verification
    const apiReq = {
      method: 'GET',
      headers: { host: 'the-tech-mystery.vercel.app' },
      query: { path: 'v1/environment' }
    };
    const apiRes = createMockResponse();
    await proxyHandler(apiReq, apiRes);

    assert.equal(apiRes.statusCode, 200);
    assert.equal(apiRes.body.toString('utf8').includes(secretValue), false, 'API response must never leak the secret key');
    for (const [headerName, headerVal] of Object.entries(apiRes.headers)) {
      assert.equal(String(headerVal).includes(secretValue), false, `Response header ${headerName} must not contain secret`);
    }
  });

  it('strips incoming client Clerk-Secret-Key to prevent header spoofing', async () => {
    let capturedOptions;
    process.env.CLERK_SECRET_KEY = 'sk_test_authentic_server_secret';

    global.fetch = mock.fn(async (url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    });

    const req = {
      method: 'GET',
      headers: {
        host: 'the-tech-mystery.vercel.app',
        'clerk-secret-key': 'attacker_supplied_spoofed_key'
      },
      query: { path: 'v1/environment' }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(capturedOptions.headers['Clerk-Secret-Key'], 'sk_test_authentic_server_secret');
    assert.equal(capturedOptions.headers['clerk-secret-key'], undefined);
  });

  it('does not read or authenticate using VITE_CLERK_SECRET_KEY when CLERK_SECRET_KEY is absent', async () => {
    delete process.env.CLERK_SECRET_KEY;
    delete process.env.CLERK_API_KEY;
    process.env.VITE_CLERK_SECRET_KEY = 'sk_test_accidental_vite_variable';

    const req = {
      method: 'GET',
      headers: { host: 'the-tech-mystery.vercel.app' },
      query: { path: 'v1/environment' }
    };
    const res = createMockResponse();

    await proxyHandler(req, res);

    // Must fail closed with 500 because secrets must not be configured as client-accessible VITE_ vars
    assert.equal(res.statusCode, 500);
    const body = JSON.parse(res.body);
    assert.equal(body.errors[0].code, 'proxy_configuration_error');

    delete process.env.VITE_CLERK_SECRET_KEY;
  });

  it('handles whitespace, casing, and surrounding quotes in CLERK_SECRET_KEY dynamically at runtime', async () => {
    let capturedOptions;
    global.fetch = mock.fn(async (url, options) => {
      capturedOptions = options;
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' }
      });
    });

    // Case 1: Surrounding quotes and whitespace in CLERK_SECRET_KEY
    process.env.CLERK_SECRET_KEY = '  "sk_test_quoted_secret_key"  ';

    const req1 = {
      method: 'GET',
      headers: { host: 'the-tech-mystery.vercel.app' },
      query: { path: 'v1/environment' }
    };
    const res1 = createMockResponse();
    await proxyHandler(req1, res1);

    assert.equal(res1.statusCode, 200);
    assert.equal(capturedOptions.headers['Clerk-Secret-Key'], 'sk_test_quoted_secret_key');

    // Case 2: Dynamically changed between requests at runtime
    process.env.CLERK_SECRET_KEY = 'sk_test_runtime_updated_key';
    const req2 = {
      method: 'GET',
      headers: { host: 'the-tech-mystery.vercel.app' },
      query: { path: 'v1/environment' }
    };
    const res2 = createMockResponse();
    await proxyHandler(req2, res2);

    assert.equal(res2.statusCode, 200);
    assert.equal(capturedOptions.headers['Clerk-Secret-Key'], 'sk_test_runtime_updated_key');
  });
});
