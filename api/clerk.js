// Vercel Serverless Function to proxy Clerk Frontend API traffic for Vite on Vercel
const FAPI_HOST = 'frontend-api.clerk.dev';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Clerk-Proxy-Url, Clerk-Secret-Key');
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

    // 2. Determine proxy URL registered with Clerk
    const host = req.headers['x-forwarded-host'] || req.headers['host'] || 'the-tech-mystery.vercel.app';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const matchedPath = req.headers['x-matched-path'] || req.url || '';
    const prefix = matchedPath.includes('.__clerk') ? '/.__clerk' : '/__clerk';
    const proxyUrl = process.env.CLERK_PROXY_URL || `${proto}://${host}${prefix}`;

    // 3. Health check response for direct verification of deployed Vercel Function
    if (!targetPath || targetPath === '/' || (req.query && req.query.health)) {
      return res.status(200).json({
        status: 'ok',
        service: 'clerk-proxy',
        target: FAPI_HOST,
        proxyUrl
      });
    }

    // 4. Build target query string (excluding internal 'path' rewrite param)
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
    const targetUrl = `https://${FAPI_HOST}${targetPath}${queryString ? '?' + queryString : ''}`;

    // 5. Construct forwarding headers
    const forwardHeaders = {};
    for (const [key, val] of Object.entries(req.headers)) {
      const lower = key.toLowerCase();
      if (!HOP_BY_HOP.has(lower) && !lower.startsWith('x-vercel-')) {
        forwardHeaders[key] = val;
      }
    }

    forwardHeaders['Host'] = FAPI_HOST;
    forwardHeaders['Clerk-Proxy-Url'] = proxyUrl;
    if (process.env.CLERK_SECRET_KEY) {
      forwardHeaders['Clerk-Secret-Key'] = process.env.CLERK_SECRET_KEY;
    }
    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress;
    if (clientIp) {
      forwardHeaders['X-Forwarded-For'] = clientIp;
    }
    forwardHeaders['X-Forwarded-Host'] = host;
    forwardHeaders['X-Forwarded-Proto'] = proto;

    // 6. Read body
    const body = (req.method === 'GET' || req.method === 'HEAD') ? undefined : await getRawBody(req);

    // 7. Forward to Clerk FAPI
    const clerkRes = await fetch(targetUrl, {
      method: req.method,
      headers: forwardHeaders,
      body,
      redirect: 'manual'
    });

    res.status(clerkRes.status);

    // 8. Forward response headers
    for (const [key, val] of clerkRes.headers.entries()) {
      const lower = key.toLowerCase();
      if (HOP_BY_HOP.has(lower) || lower === 'content-encoding' || lower === 'content-length') {
        continue;
      }
      if (lower === 'location') {
        try {
          const locUrl = new URL(val, `https://${FAPI_HOST}`);
          if (locUrl.host === FAPI_HOST) {
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
