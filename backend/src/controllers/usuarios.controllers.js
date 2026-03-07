const models = require('../models/entities.models');
const bcrypt = require('bcryptjs');
const { normalizeUsuarioPayload } = require('./normalizador-http');

module.exports = {
  getAll: async (req, res) => {
    try {
      const usuarios = await models.Usuarios.getAll();
      res.json({ success: true, data: usuarios });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const usuario = await models.Usuarios.getById(req.params.id);
      if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      res.json({ success: true, data: usuario });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByEmail: async (req, res) => {
    try {
      const usuario = await models.Usuarios.getByEmail(req.params.email);
      if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      res.json({ success: true, data: usuario });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByDocumento: async (req, res) => {
    try {
      const usuario = await models.Usuarios.getByDocumento(req.params.documento);
      if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      res.json({ success: true, data: usuario });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const normalized = normalizeUsuarioPayload(req.body);
      if (normalized.error) {
        return res.status(400).json({ success: false, message: normalized.error });
      }

      const payload = normalized.data;

      const existingEmail = await models.Usuarios.getByEmail(payload.email);
      if (existingEmail) {
        return res.status(409).json({ success: false, message: 'El correo ya esta registrado' });
      }

      const existingDoc = await models.Usuarios.getByDocumento(payload.documento);
      if (existingDoc) {
        return res.status(409).json({ success: false, message: 'El documento ya esta registrado' });
      }

      const plainPassword = payload.password || payload.password_hash;
      if (!plainPassword || typeof plainPassword !== 'string') {
        return res.status(400).json({ success: false, message: 'La contrasena es obligatoria' });
      }

      const password_hash = await bcrypt.hash(plainPassword, 10);
      const id = await models.Usuarios.create({ ...payload, password_hash });
      res.status(201).json({ success: true, id, message: 'Usuario creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const normalized = normalizeUsuarioPayload(req.body);
      if (normalized.error) {
        return res.status(400).json({ success: false, message: normalized.error });
      }

      await models.Usuarios.update(req.params.id, normalized.data);
      if (normalized.data.password && typeof normalized.data.password === 'string') {
        const newHash = await bcrypt.hash(normalized.data.password, 10);
        await models.Usuarios.updatePasswordHash(req.params.id, newHash);
      }
      res.json({ success: true, message: 'Usuario actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  assignRole: async (req, res) => {
    try {
      const { rol_id } = req.body;
      if (!rol_id) {
        return res.status(400).json({ success: false, message: 'rol_id es obligatorio' });
      }

      const usuario = await models.Usuarios.getById(req.params.id);
      if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
      }

      const rol = await models.Roles.getById(rol_id);
      if (!rol) {
        return res.status(404).json({ success: false, message: 'Rol no encontrado' });
      }

      await models.Usuarios.assignRole(req.params.id, rol_id);
      res.json({ success: true, message: 'Rol asignado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Usuarios.delete(req.params.id);
      res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

