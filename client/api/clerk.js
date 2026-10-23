// Vercel Serverless Function to proxy Clerk Frontend API traffic for Vite on Vercel

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'host'
]);

function parsePublishableKey(key) {
  if (!key || typeof key !== 'string') return null;
  const match = key.match(/^pk_(test|live)_([a-zA-Z0-9_\-]+)\$?$/);
  if (!match) return null;
  const [_, instanceType, encoded] = match;
  try {
    const raw = Buffer.from(encoded, 'base64').toString('utf8');
    const frontendApi = raw.endsWith('$') ? raw.slice(0, -1) : raw;
    return {
      instanceType: instanceType === 'test' ? 'development' : 'production',
      frontendApi
    };
  } catch {
    return null;
  }
}

function getFapiHost(publishableKey) {
  if (process.env.CLERK_FAPI_URL) {
    try {
      return new URL(process.env.CLERK_FAPI_URL).host;
    } catch (_) {}
  }
  const parsed = parsePublishableKey(publishableKey || process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY);
  const frontendApi = parsed?.frontendApi;
  if (!frontendApi) return 'frontend-api.clerk.dev';

  if (frontendApi.endsWith('.accounts.dev') || frontendApi.endsWith('.accountsstage.dev')) {
    return frontendApi;
  }
  return 'frontend-api.clerk.dev';
}

async function getRawBody(req) {
  if (req.body) {
    if (Buffer.isBuffer(req.body)) return req.body;
    if (typeof req.body === 'string') return Buffer.from(req.body);
    return Buffer.from(JSON.stringify(req.body));
  }
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}

export default async function handler(req, res) {
  // CORS configuration
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Clerk-Proxy-Url, Clerk-Secret-Key, X-Clerk-Publishable-Key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // 1. Determine subpath
    let targetPath = '';
    if (req.query && req.query.path) {
      targetPath = Array.isArray(req.query.path) ? req.query.path.join('/') : req.query.path;
    } else {
      const originalPath = req.headers['x-matched-path'] || req.url || '';
      const match = originalPath.match(/^(\/(\.?__clerk|api\/clerk(-proxy)?))(\/.*)?$/);
      if (match && match[4]) {
        targetPath = match[4];
      }
    }

    if (targetPath && !targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }

    // 2. Resolve secret key and publishable key
    const secretKey = process.env.CLERK_SECRET_KEY || process.env.CLERK_API_KEY || process.env.VITE_CLERK_SECRET_KEY;
    const publishableKey = process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY;
    const fapiHost = getFapiHost(publishableKey);

    // 3. Determine proxy URL registered with Clerk
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'the-tech-mystery.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const matchedPath = req.headers['x-matched-path'] || req.url || '';
    const prefix = matchedPath.includes('.__clerk') ? '/.__clerk' : (matchedPath.includes('__clerk') ? '/__clerk' : '/.__clerk');
    const proxyUrl = process.env.CLERK_PROXY_URL || `${proto}://${host}${prefix}`;

    // 4. Health check response for direct verification of deployed Vercel Function
    if (!targetPath || targetPath === '/' || (req.query && req.query.health)) {
      return res.status(200).json({
        status: 'ok',
        service: 'clerk-proxy',
        target: fapiHost,
        proxyUrl,
        hasSecretKey: !!secretKey,
        hasPublishableKey: !!publishableKey
      });
    }

    // 5. Fail early with descriptive error if secret key is missing for API requests
    const isScriptRequest = targetPath.startsWith('/npm/');
    if (!secretKey && !isScriptRequest) {
      return res.status(500).json({
        errors: [
          {
            code: 'proxy_configuration_error',
            message: 'Missing CLERK_SECRET_KEY environment variable. Add CLERK_SECRET_KEY in Vercel Project Settings > Environment Variables and redeploy.'
          }
        ]
      });
    }

    // 6. Build target query string (excluding internal 'path' rewrite param)
    const searchParams = new URLSearchParams();
    if (targetPath.includes('?')) {
      const [cleanPath, extraQuery] = targetPath.split('?');
      targetPath = cleanPath;
      const extraParams = new URLSearchParams(extraQuery);
      for (const [k, v] of extraParams.entries()) {
        searchParams.append(k, v);
      }
    }

    if (req.query) {
      for (const [key, val] of Object.entries(req.query)) {
        if (key !== 'path') {
          if (Array.isArray(val)) {
            val.forEach(v => searchParams.append(key, v));
          } else if (val !== undefined && val !== null) {
            searchParams.append(key, val);
          }
        }
      }
    }

    const queryString = searchParams.toString();
    const targetUrl = `https://${fapiHost}${targetPath}${queryString ? '?' + queryString : ''}`;

    // 7. Construct forwarding headers
    const forwardHeaders = {};
    for (const [key, val] of Object.entries(req.headers)) {
      const lower = key.toLowerCase();
      if (!HOP_BY_HOP.has(lower) && !lower.startsWith('x-vercel-')) {
        forwardHeaders[key] = val;
      }
    }

    forwardHeaders['Host'] = fapiHost;
    forwardHeaders['Clerk-Proxy-Url'] = proxyUrl;
    if (secretKey) {
      forwardHeaders['Clerk-Secret-Key'] = secretKey;
    }
    forwardHeaders['Accept-Encoding'] = 'identity';

    const clientIp = req.headers['x-forwarded-for']?.split(',')?.[0]?.trim() || req.socket?.remoteAddress;
    if (clientIp) {
      forwardHeaders['X-Forwarded-For'] = clientIp;
    }
    forwardHeaders['X-Forwarded-Host'] = host;
    forwardHeaders['X-Forwarded-Proto'] = proto;

    // 8. Read body
    const body = (req.method === 'GET' || req.method === 'HEAD') ? undefined : await getRawBody(req);

    // 9. Forward to Clerk FAPI
    const clerkRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual'
    });

    res.status(clerkRes.status);

    // 10. Forward response headers
    for (const [key, val] of clerkRes.headers.entries()) {
      const lower = key.toLowerCase();
      if (HOP_BY_HOP.has(lower) || lower === 'content-encoding' || lower === 'content-length') {
        continue;
      }
      if (lower === 'location') {
        try {
          const locUrl = new URL(val, `https://${fapiHost}`);
          if (locUrl.host === fapiHost) {
            res.setHeader('location', `${prefix}${locUrl.pathname}${locUrl.search}${locUrl.hash}`);
            continue;
          }
        } catch (_) {}
      }
      if (lower === 'set-cookie') {
        const rawCookies = typeof clerkRes.headers.getSetCookie === 'function'
          ? clerkRes.headers.getSetCookie()
          : [val];
        res.setHeader('set-cookie', rawCookies);
        continue;
      }
      res.setHeader(key, val);
    }

    const resBuffer = Buffer.from(await clerkRes.arrayBuffer());
    if (resBuffer.length === 0) {
      res.end();
    } else {
      res.send(resBuffer);
    }
  } catch (error) {
    console.error('[Clerk Proxy Error]:', error);
    res.status(502).json({
      error: 'clerk_proxy_error',
      message: error.message || 'Failed to proxy request to Clerk Frontend API'
    });
  }
}
