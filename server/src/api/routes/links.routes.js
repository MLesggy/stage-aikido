const express = require('express');
const router = express.Router();
const linksController = require('../controllers/links.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les liens
router.get('/', linksController.getAllLinks);
router.get('/:id', linksController.getLinkById);
router.post('/', authMiddleware, linksController.createLink);
router.put('/:id', authMiddleware, linksController.updateLink);
router.delete('/:id', authMiddleware, linksController.deleteLink);

module.exports = router;