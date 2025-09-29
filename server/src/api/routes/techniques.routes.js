const express = require('express');
const router = express.Router();
const techniquesController = require('../controllers/techniques.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les techniques
router.get('/', techniquesController.getAllTechniques);
router.get('/:id', techniquesController.getTechniqueById);
router.post('/', authMiddleware, techniquesController.createTechnique);
router.put('/:id', authMiddleware, techniquesController.updateTechnique);
router.delete('/:id', authMiddleware, techniquesController.deleteTechnique);

module.exports = router;