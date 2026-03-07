const express = require('express');
const controller = require('../controllers/clientes.controllers');

const router = express.Router();
router.get('/', controller.getAll);
router.get('/documento/:documento', controller.getByDocumento);
router.get('/email/:email', controller.getByEmail);
router.get('/usuario/:usuarioId', controller.getByUsuarioId);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
