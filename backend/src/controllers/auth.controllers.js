const models = require('../models/entities.models');
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { normalizeAuthRegisterPayload } = require('./normalizador-http');
const { buildUsernameFromEmail } = require('../utils/credentials');
const { generateTempPassword, isStrongPassword } = require('../utils/credentials');
const { sendTemporaryPasswordEmail } = require('../services/email.service');

const passwordTokenExpiryMs = 15 * 60 * 1000;

const getLoginIdentifier = (value) => String(value || '').trim().toLowerCase();

const hashResetToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getSessionTtlByRole = (roleName) => {
  return roleName === 'Cliente' ? config.auth.clienteTokenTtlMs : config.auth.staffTokenTtlMs;
};

const buildCookieOptions = (maxAge) => {
  const options = {
    httpOnly: true,
    secure: config.auth.cookieSecure,
    sameSite: config.auth.cookieSameSite,
    path: '/',
  };

  if (typeof maxAge === 'number') {
    options.maxAge = maxAge;
  }

  if (config.auth.cookieDomain) {
    options.domain = config.auth.cookieDomain;
  }

  return options;
};

const mapUserForResponse = (usuario, roleName, clienteId, permissions = []) => ({
  id: usuario.id,
  email: usuario.email,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  username: usuario.username,
  rol: roleName,
  rol_id: usuario.rol_id,
  cliente_id: clienteId,
  permisos: permissions,
});

const buildSessionMetadata = (sessionExpiresAtMs) => {
  if (!sessionExpiresAtMs) return {};

  return {
    session_expires_at: new Date(sessionExpiresAtMs).toISOString(),
    session_remaining_ms: Math.max(0, sessionExpiresAtMs - Date.now()),
  };
};

const resolveUserRoleAndClienteId = async (usuario) => {
  const rol = usuario.rol_id ? await models.Roles.getById(usuario.rol_id) : null;
  const roleName = rol?.nombre || usuario.rol || 'Cliente';
  const permissions = Array.isArray(rol?.permisos) ? rol.permisos : [];
  let clienteId = null;

  if (roleName === 'Cliente') {
    const cliente = await models.Clientes.getOrCreateByUsuarioId(usuario.id);
    clienteId = cliente?.id || null;
  }

  return { roleName, clienteId, permissions };
};

const headerValueToString = (value) => {
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'string') return value;
  return null;
};

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password, rememberMe } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Correo y contrasena son obligatorios' });
      }

      const identifier = getLoginIdentifier(email);
      const blocked = await models.Usuarios.isLoginBlocked(identifier);
      if (blocked) {
        return res.status(429).json({ success: false, message: 'Cuenta bloqueada temporalmente por intentos fallidos' });
      }

      const usuario = await models.Usuarios.getByEmailOrUsername(identifier);
      if (!usuario) {
        await models.Usuarios.registerLoginFailure(identifier);
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      if (usuario.estado !== 'Activo') {
        return res.status(403).json({ success: false, message: 'La cuenta esta inactiva' });
      }

      const isValid = await bcrypt.compare(password, usuario.password_hash || '');
      if (!isValid) {
        await models.Usuarios.registerLoginFailure(identifier);
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      await models.Usuarios.clearLoginAttempts(identifier);

      const { roleName, clienteId, permissions } = await resolveUserRoleAndClienteId(usuario);
      const sessionTtlMs = rememberMe ? config.auth.longSessionTtlMs || getSessionTtlByRole(roleName) : getSessionTtlByRole(roleName);
      const expiresInSeconds = Math.floor(sessionTtlMs / 1000);
      const sessionExpiresAtMs = Date.now() + sessionTtlMs;

      const sessionJti = crypto.randomUUID();
      const token = jwt.sign(
        {
          id: usuario.id,
          rol: roleName,
          rol_id: usuario.rol_id,
          cliente_id: clienteId,
          email: usuario.email,
        },
        config.auth.jwtSecret,
        {
          algorithm: 'HS256',
          subject: String(usuario.id),
          issuer: config.auth.jwtIssuer,
          audience: config.auth.jwtAudience,
          expiresIn: expiresInSeconds,
          jwtid: sessionJti,
        }
      );

      await models.Usuarios.registerSession({
        usuarioId: usuario.id,
        jti: sessionJti,
        expiresAt: sessionExpiresAtMs,
        ipAddress: headerValueToString(req.headers['x-forwarded-for']) || req.socket?.remoteAddress || null,
        userAgent: headerValueToString(req.headers['user-agent']),
      });

      res.cookie(config.auth.cookieName, token, buildCookieOptions(sessionTtlMs));

      res.json({
        success: true,
        message: 'Inicio de sesion exitoso',
        data: {
          ...mapUserForResponse(usuario, roleName, clienteId, permissions),
          expires_in_ms: sessionTtlMs,
          ...buildSessionMetadata(sessionExpiresAtMs),
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  me: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }

      const usuario = await models.Usuarios.getById(userId);
      if (!usuario || usuario.estado !== 'Activo') {
        return res.status(401).json({ success: false, message: 'Sesion invalida' });
      }

      const { roleName, clienteId, permissions } = await resolveUserRoleAndClienteId(usuario);

      return res.json({
        success: true,
        data: {
          ...mapUserForResponse(usuario, roleName, clienteId, permissions),
          ...buildSessionMetadata(req.user?.session_expires_at_ms),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const closeAll = req.body?.closeAll === true || req.body?.closeAll === 'true';
      if (closeAll && req.user?.id) {
        await pool.query('UPDATE usuarios_sesiones SET revoked_at = CURRENT_TIMESTAMP, last_seen_at = CURRENT_TIMESTAMP WHERE usuario_id = $1', [req.user.id]);
      } else if (req.user?.session_jti) {
        await models.Usuarios.revokeSession(req.user.session_jti);
      }
      res.clearCookie(config.auth.cookieName, buildCookieOptions());
      return res.json({ success: true, message: 'Sesion cerrada', data: null });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }

      const currentPassword = String(req.body?.currentPassword || '').trim();
      const newPassword = String(req.body?.newPassword || '').trim();
      const confirmPassword = String(req.body?.confirmPassword || '').trim();

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Las contraseñas no coinciden' });
      }

      if (!isStrongPassword(newPassword)) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña no cumple con los requisitos de seguridad' });
      }

      const usuario = await models.Usuarios.getById(userId);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const currentValid = await bcrypt.compare(currentPassword, usuario.password_hash || '');
      if (!currentValid) {
        return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
      }

      const passwordHistory = await models.Usuarios.getPasswordHistory(userId, 3);
      for (const storedHash of passwordHistory) {
        if (await bcrypt.compare(newPassword, storedHash)) {
          return res.status(409).json({ success: false, message: 'No puedes reutilizar una contraseña reciente' });
        }
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await models.Usuarios.updatePasswordHash(userId, newHash);
      await models.Usuarios.storePasswordHistory(userId, newHash);

      return res.json({ success: true, message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  requestPasswordReset: async (req, res) => {
    try {
      const email = getLoginIdentifier(req.body?.email);
      if (!email) {
        return res.status(400).json({ success: false, message: 'El correo es obligatorio' });
      }

      const usuario = await models.Usuarios.getByEmailOrUsername(email);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'No existe una cuenta asociada a este correo' });
      }

      const token = generateTempPassword();
      const tokenHash = hashResetToken(token);
      const expiresAt = Date.now() + passwordTokenExpiryMs;

      await models.Usuarios.createPasswordResetToken({
        usuarioId: usuario.id,
        tokenHash,
        expiresAt,
      });

      await sendTemporaryPasswordEmail({
        to: usuario.email,
        name: `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim(),
        username: usuario.username,
        tempPassword: token,
      });

      return res.json({ success: true, message: 'Se envió el código de recuperación al correo registrado' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  confirmPasswordReset: async (req, res) => {
    try {
      const email = getLoginIdentifier(req.body?.email);
      const token = String(req.body?.token || '').trim();
      const newPassword = String(req.body?.newPassword || '').trim();

      if (!email || !token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, código y nueva contraseña son obligatorios' });
      }

      if (!isStrongPassword(newPassword)) {
        return res.status(400).json({ success: false, message: 'La nueva contraseña no cumple con los requisitos de seguridad' });
      }

      const resetRow = await models.Usuarios.consumePasswordResetToken({
        email,
        tokenHash: hashResetToken(token),
      });

      if (!resetRow) {
        return res.status(400).json({ success: false, message: 'Código inválido o expirado' });
      }

      const usuario = await models.Usuarios.getById(resetRow.usuario_id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const passwordHistory = await models.Usuarios.getPasswordHistory(usuario.id, 3);
      for (const storedHash of passwordHistory) {
        if (await bcrypt.compare(newPassword, storedHash)) {
          return res.status(409).json({ success: false, message: 'No puedes reutilizar una contraseña reciente' });
        }
      }

      const newHash = await bcrypt.hash(newPassword, 10);
      await models.Usuarios.updatePasswordHash(usuario.id, newHash);
      await models.Usuarios.storePasswordHistory(usuario.id, newHash);

      return res.json({ success: true, message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  logoutAll: async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'No autenticado' });
      }

      await pool.query('UPDATE usuarios_sesiones SET revoked_at = CURRENT_TIMESTAMP, last_seen_at = CURRENT_TIMESTAMP WHERE usuario_id = $1', [userId]);
      res.clearCookie(config.auth.cookieName, buildCookieOptions());
      return res.json({ success: true, message: 'Todas las sesiones fueron cerradas' });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  registerCliente: async (req, res) => {
    const client = await pool.connect();

    try {
      const normalizedRegister = normalizeAuthRegisterPayload(req.body);
      if (normalizedRegister.error) {
        return res.status(400).json({ success: false, message: normalizedRegister.error });
      }

      const {
        tipoDocumento,
        numeroDocumento,
        nombre,
        apellido,
        direccion,
        email,
        telefono,
        password,
      } = normalizedRegister.data;

      if (!numeroDocumento || !nombre || !apellido || !direccion || !email || !password) {
        return res.status(400).json({ success: false, message: 'Faltan campos obligatorios para el registro' });
      }

      await client.query('BEGIN');

      const emailInUsuarios = await client.query('SELECT id FROM usuarios WHERE email = $1', [email]);
      if (emailInUsuarios.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ success: false, message: 'El correo ya esta registrado' });
      }

      const documentoInUsuarios = await client.query('SELECT id FROM usuarios WHERE documento = $1', [numeroDocumento]);
      if (documentoInUsuarios.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ success: false, message: 'El documento ya esta registrado' });
      }

      const emailInClientes = await client.query('SELECT id FROM clientes WHERE email = $1', [email]);
      if (emailInClientes.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ success: false, message: 'El correo ya esta registrado en clientes' });
      }

      const documentoInClientes = await client.query('SELECT id FROM clientes WHERE documento = $1', [numeroDocumento]);
      if (documentoInClientes.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({ success: false, message: 'El documento ya esta registrado en clientes' });
      }

      const clienteRole = await client.query('SELECT id FROM roles WHERE nombre = $1', ['Cliente']);
      if (clienteRole.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(500).json({ success: false, message: 'No existe el rol Cliente en la base de datos' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const username = await buildUsernameFromEmail(client, email);

      const userResult = await client.query(
        `INSERT INTO usuarios
        (nombre, apellido, tipo_documento, documento, direccion, email, username, telefono, password_hash, rol_id, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Activo')
        RETURNING id`,
        [
          nombre,
          apellido,
          tipoDocumento,
          numeroDocumento,
          direccion,
          email,
          username,
          telefono || null,
          passwordHash,
          clienteRole.rows[0].id,
        ]
      );

      const clienteResult = await client.query(
        `INSERT INTO clientes
        (usuario_id, nombre, apellido, tipo_documento, documento, telefono, email, direccion, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Activo')
        RETURNING id`,
        [
          userResult.rows[0].id,
          nombre,
          apellido,
          tipoDocumento,
          numeroDocumento,
          telefono || null,
          email,
          direccion,
        ]
      );

      await client.query('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Cliente registrado exitosamente',
        data: {
          cliente_id: clienteResult.rows[0].id,
          usuario_id: userResult.rows[0].id,
        },
      });
    } catch (error) {
      await client.query('ROLLBACK');
      res.status(500).json({ success: false, message: error.message });
    } finally {
      client.release();
    }
  },
};

