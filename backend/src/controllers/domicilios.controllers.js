const models = require('../models/entities.models');

module.exports = {
  getAll: async (req, res) => {
    try {
      const domicilios = await models.Domicilios.getAll();
      res.json({ success: true, data: domicilios });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const domicilio = await models.Domicilios.getById(req.params.id);
      if (!domicilio) return res.status(404).json({ success: false, message: 'Domicilio no encontrado' });
      res.json({ success: true, data: domicilio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByPedido: async (req, res) => {
    try {
      const domicilio = await models.Domicilios.getByPedido(req.params.pedidoId);
      res.json({ success: true, data: domicilio });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Domicilios.create(req.body);
      res.status(201).json({ success: true, id, message: 'Domicilio creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Domicilios.update(req.params.id, req.body);
      res.json({ success: true, message: 'Domicilio actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Domicilios.delete(req.params.id);
      res.json({ success: true, message: 'Domicilio eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

