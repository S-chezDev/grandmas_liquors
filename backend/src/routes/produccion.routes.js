const express = require('express');
const controller = require('../controllers/produccion.controllers');

const router = express.Router();
router.get('/', controller.getAll);
// Listar insumos entregados disponibles para un productor (ANTES de /:id para
// que la ruta no sea capturada por el patron parametrico).
router.get('/insumos-disponibles/:productorId', controller.getInsumosByProductor);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/estado', controller.updateStatus);
router.patch('/:id/estado', controller.updateStatus);
router.delete('/:id', controller.delete);

module.exports = router;

