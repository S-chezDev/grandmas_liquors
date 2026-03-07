const jwt = require('jsonwebtoken');
const config = require('../../config');

const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.[config.auth.cookieName];
  if (cookieToken) return cookieToken;

  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.slice('Bearer '.length).trim();
  }

  return null;
};

const authenticateJWT = (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ success: false, message: 'No autenticado' });
    }

    const payload = jwt.verify(token, config.auth.jwtSecret, {
      algorithms: ['HS256'],
      issuer: config.auth.jwtIssuer,
      audience: config.auth.jwtAudience,
    });

    const userId = Number(payload.sub || payload.id);
    if (!Number.isFinite(userId)) {
      return res.status(401).json({ success: false, message: 'Token invalido' });
    }

    req.user = {
      id: userId,
      rol: payload.rol,
      rol_id: payload.rol_id,
      cliente_id: payload.cliente_id || null,
      email: payload.email,
      session_expires_at_ms: typeof payload.exp === 'number' ? payload.exp * 1000 : null,
    };

    return next();
  } catch (error) {
    const message = error.name === 'TokenExpiredError' ? 'Sesion expirada' : 'Token invalido';
    return res.status(401).json({ success: false, message });
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'No autenticado' });
  }

  if (!roles.includes(req.user.rol)) {
    return res.status(403).json({ success: false, message: 'No autorizado' });
  }

  return next();
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
};
