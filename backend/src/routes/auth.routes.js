const express = require('express');
const controller = require('../controllers/auth.controllers');

const router = express.Router();
router.post('/login', controller.login);
router.post('/register-cliente', controller.registerCliente);

module.exports = router;
