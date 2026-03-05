const models = require('../../models/entities.models');

module.exports = {
  getAll: async (req, res) => {
    try {
      const clientes = await models.Clientes.getAll();
      res.json({ success: true, data: clientes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const cliente = await models.Clientes.getById(req.params.id);
      if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      res.json({ success: true, data: cliente });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByDocumento: async (req, res) => {
    try {
      const cliente = await models.Clientes.getByDocumento(req.params.documento);
      if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
      res.json({ success: true, data: cliente });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Clientes.create(req.body);
      res.status(201).json({ success: true, id, message: 'Cliente creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Clientes.update(req.params.id, req.body);
      res.json({ success: true, message: 'Cliente actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Clientes.delete(req.params.id);
      res.json({ success: true, message: 'Cliente eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
