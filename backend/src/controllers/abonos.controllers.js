const models = require('../../models/entities.models');

module.exports = {
  getAll: async (req, res) => {
    try {
      const abonos = await models.Abonos.getAll();
      res.json({ success: true, data: abonos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const abono = await models.Abonos.getById(req.params.id);
      if (!abono) return res.status(404).json({ success: false, message: 'Abono no encontrado' });
      res.json({ success: true, data: abono });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByPedido: async (req, res) => {
    try {
      const abonos = await models.Abonos.getByPedido(req.params.pedidoId);
      res.json({ success: true, data: abonos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Abonos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Abono creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Abonos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Abono actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Abonos.delete(req.params.id);
      res.json({ success: true, message: 'Abono eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};
