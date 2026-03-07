const models = require('../models/entities.models');
const pool = require('../../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { normalizeAuthRegisterPayload } = require('./normalizador-http');

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

const mapUserForResponse = (usuario, roleName, clienteId) => ({
  id: usuario.id,
  email: usuario.email,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  rol: roleName,
  rol_id: usuario.rol_id,
  cliente_id: clienteId,
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
  let clienteId = null;

  if (roleName === 'Cliente') {
    const cliente = await models.Clientes.getOrCreateByUsuarioId(usuario.id);
    clienteId = cliente?.id || null;
  }

  return { roleName, clienteId };
};

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Correo y contrasena son obligatorios' });
      }

      const usuario = await models.Usuarios.getByEmail(email);
      if (!usuario) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      if (usuario.estado !== 'Activo') {
        return res.status(403).json({ success: false, message: 'La cuenta esta inactiva' });
      }

      const isValid = await bcrypt.compare(password, usuario.password_hash || '');
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
      }

      const { roleName, clienteId } = await resolveUserRoleAndClienteId(usuario);
      const sessionTtlMs = getSessionTtlByRole(roleName);
      const expiresInSeconds = Math.floor(sessionTtlMs / 1000);
      const sessionExpiresAtMs = Date.now() + sessionTtlMs;

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
        }
      );

      res.cookie(config.auth.cookieName, token, buildCookieOptions(sessionTtlMs));

      res.json({
        success: true,
        message: 'Inicio de sesion exitoso',
        data: {
          ...mapUserForResponse(usuario, roleName, clienteId),
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

      const { roleName, clienteId } = await resolveUserRoleAndClienteId(usuario);

      return res.json({
        success: true,
        data: {
          ...mapUserForResponse(usuario, roleName, clienteId),
          ...buildSessionMetadata(req.user?.session_expires_at_ms),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie(config.auth.cookieName, buildCookieOptions());
      return res.json({ success: true, message: 'Sesion cerrada', data: null });
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

      const userResult = await client.query(
        `INSERT INTO usuarios
        (nombre, apellido, tipo_documento, documento, direccion, email, telefono, password_hash, rol_id, estado)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Activo')
        RETURNING id`,
        [
          nombre,
          apellido,
          tipoDocumento,
          numeroDocumento,
          direccion,
          email,
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

