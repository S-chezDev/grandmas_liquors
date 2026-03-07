const express = require('express');
const controller = require('../controllers/auth.controllers');
const { authenticateJWT } = require('../middlewares/auth.middleware');

const router = express.Router();
router.post('/login', controller.login);
router.get('/me', authenticateJWT, controller.me);
router.post('/logout', controller.logout);
router.post('/register-cliente', controller.registerCliente);

module.exports = router;
