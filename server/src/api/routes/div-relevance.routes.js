const express = require('express');
const router = express.Router();
const divRelevanceController = require('../controllers/div-relevance.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les divRelevance
router.get('/', divRelevanceController.getAllDivRelevance);
router.get('/:id', divRelevanceController.getDivRelevanceById);
router.post('/', authMiddleware, divRelevanceController.createDivRelevance);
router.put('/:id', authMiddleware, divRelevanceController.updateDivRelevance);
router.delete('/:id', authMiddleware, divRelevanceController.deleteDivRelevance);

module.exports = router;