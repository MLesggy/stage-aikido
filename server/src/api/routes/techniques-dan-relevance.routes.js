const express = require('express');
const router = express.Router();
const techniquesDanRelevanceController = require('../controllers/techniques-dan-relevance.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les techniques dan relevance
router.get('/', techniquesDanRelevanceController.getAllTechniquesDanRelevance);
router.get('/:techniqueId/:danGradeId', techniquesDanRelevanceController.getTechniqueDanRelevanceById);
router.post('/', authMiddleware, techniquesDanRelevanceController.createTechniqueDanRelevance);
router.put('/:techniqueId', authMiddleware, techniquesDanRelevanceController.updateTechniqueDanRelevance);
router.delete('/:techniqueId/:danGradeId', authMiddleware, techniquesDanRelevanceController.deleteTechniqueDanRelevance);

module.exports = router;
