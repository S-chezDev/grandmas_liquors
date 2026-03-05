const express = require('express');
const controller = require('../controllers/usuarios.controllers');

const router = express.Router();
router.get('/', controller.getAll);
router.get('/email/:email', controller.getByEmail);
router.get('/documento/:documento', controller.getByDocumento);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/:id/rol', controller.assignRole);
router.delete('/:id', controller.delete);

module.exports = router;
