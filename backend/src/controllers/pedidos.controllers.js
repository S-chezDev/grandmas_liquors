const models = require('../models/entities.models');

module.exports = {
  getAll: async (req, res) => {
    try {
      const pedidos = await models.Pedidos.getAll();
      res.json({ success: true, data: pedidos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const pedido = await models.Pedidos.getById(req.params.id);
      if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
      const detalles = await models.Pedidos.getDetalles(req.params.id);
      res.json({ success: true, data: { ...pedido, detalles } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getByCliente: async (req, res) => {
    try {
      const pedidos = await models.Pedidos.getByCliente(req.params.clienteId);
      res.json({ success: true, data: pedidos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  create: async (req, res) => {
    try {
      const id = await models.Pedidos.create(req.body);
      res.status(201).json({ success: true, id, message: 'Pedido creado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  addProducto: async (req, res) => {
    try {
      const { pedidoId, productoId, cantidad, precioUnitario } = req.body;
      await models.Pedidos.addDetalle(pedidoId, productoId, cantidad, precioUnitario);
      res.status(201).json({ success: true, message: 'Producto agregado al pedido' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      await models.Pedidos.update(req.params.id, req.body);
      res.json({ success: true, message: 'Pedido actualizado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      await models.Pedidos.delete(req.params.id);
      res.json({ success: true, message: 'Pedido eliminado exitosamente' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

