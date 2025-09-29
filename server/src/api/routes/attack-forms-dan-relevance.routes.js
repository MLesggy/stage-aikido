const express = require('express');
const router = express.Router();
const attackFormsDanRelevanceController = require('../controllers/attack-forms-dan-relevance.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour la table intermediaire dan relevance des formes d'attaques
router.get('/', attackFormsDanRelevanceController.getAllAttackFormsDanRelevance);
router.get('/:attackFormId/:danGradeId', attackFormsDanRelevanceController.getAttackFormDanRelevanceById);
router.post('/', authMiddleware, attackFormsDanRelevanceController.createAttackFormDanRelevance);
router.put('/:attackFormId', authMiddleware, attackFormsDanRelevanceController.updateAttackFormDanRelevance);
router.delete('/:attackFormId/:danGradeId', authMiddleware, attackFormsDanRelevanceController.deleteAttackFormDanRelevance);

module.exports = router;