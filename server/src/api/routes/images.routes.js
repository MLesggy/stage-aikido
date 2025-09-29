const express = require('express');
const router = express.Router();
const imagesController = require('../controllers/images.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les images
router.get('/', imagesController.getAllImages);
router.get('/:id', imagesController.getImageById);
router.post('/', authMiddleware,imagesController.createImage);
router.put('/:id', authMiddleware, imagesController.updateImage);
router.delete('/:id', authMiddleware, imagesController.deleteImage);

module.exports = router;