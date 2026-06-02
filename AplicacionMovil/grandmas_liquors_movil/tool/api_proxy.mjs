/**
 * Proxy local para Flutter web: evita CORS y permite cookies de sesión en localhost.
 * Uso: node tool/api_proxy.mjs
 * Luego: flutter run -d chrome
 */
import http from 'http';

const TARGET_HOST = 'apigrandmasliquors.us-east-1.elasticbeanstalk.com';
const TARGET_PORT = 80;
const LISTEN_PORT = Number(process.env.API_PROXY_PORT || 3002);

const rewriteSetCookie = (value) => {
  if (!value) return value;
  const list = Array.isArray(value) ? value : [value];
  return list.map((cookie) =>
    cookie
      .replace(/;?\s*Domain=[^;]*/gi, '')
      .replace(/;?\s*Secure/gi, '')
  );
};

const applyCors = (req, resHeaders) => {
  const origin = req.headers.origin;
  if (!origin) return resHeaders;
  return {
    ...resHeaders,
    'access-control-allow-origin': origin,
    'access-control-allow-credentials': 'true',
    vary: 'Origin',
  };
};

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, applyCors(req, {
      'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'access-control-allow-headers':
        req.headers['access-control-request-headers'] ||
        'Content-Type, Authorization, X-Requested-With',
    }));
    res.end();
    return;
  }

  const path = req.url || '/';
  const proxyReq = http.request(
    {
      hostname: TARGET_HOST,
      port: TARGET_PORT,
      path,
      method: req.method,
      headers: {
        ...req.headers,
        host: TARGET_HOST,
      },
    },
    (proxyRes) => {
      let headers = { ...proxyRes.headers };
      if (headers['set-cookie']) {
        headers['set-cookie'] = rewriteSetCookie(headers['set-cookie']);
      }
      headers = applyCors(req, headers);
      res.writeHead(proxyRes.statusCode || 502, headers);
      proxyRes.pipe(res);
    }
  );

  proxyReq.on('error', (err) => {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(
      JSON.stringify({
        success: false,
        message: `Proxy no pudo conectar con ${TARGET_HOST}: ${err.message}`,
      })
    );
  });

  req.pipe(proxyReq);
});

server.listen(LISTEN_PORT, () => {
  console.log(`[api_proxy] http://localhost:${LISTEN_PORT} -> http://${TARGET_HOST}`);
  console.log('[api_proxy] Deje esta ventana abierta mientras usa Flutter web (Chrome).');
});
