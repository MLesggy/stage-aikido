const express = require('express');
const router = express.Router();
const recommendationsController = require('../controllers/recommendations.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les recommendations
router.get('/', recommendationsController.getAllRecommendations);
router.get('/:id', recommendationsController.getRecommendationById);
router.post('/', authMiddleware, recommendationsController.createRecommendation);
router.put('/:id', authMiddleware, recommendationsController.updateRecommendation);
router.delete('/:id', authMiddleware, recommendationsController.deleteRecommendation);

module.exports = router;