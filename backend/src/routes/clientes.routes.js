const express = require('express');
const multer = require('multer');
const controller = require('../controllers/clientes.controllers');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Formato de imagen no permitido. Usa JPG, PNG o WEBP.'));
  },
});

const uploadProfilePhotoHandler = (req, res, next) => {
  upload.single('foto')(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'La imagen no puede superar 2MB.' });
    }
    return res.status(400).json({ success: false, message: error.message || 'No fue posible procesar la imagen.' });
  });
};

router.get('/', controller.getAll);
router.get('/documento/:documento', controller.getByDocumento);
router.get('/email/:email', controller.getByEmail);
router.get('/usuario/:usuarioId', controller.getByUsuarioId);
router.post('/perfil/foto', uploadProfilePhotoHandler, controller.uploadProfilePhoto);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
