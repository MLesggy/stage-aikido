const express = require('express');
const router = express.Router();
const seminarsController = require('../controllers/seminars.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les seminaires
router.get('/', seminarsController.getAllSeminars);
router.get('/:id', seminarsController.getSeminarById);
router.post('/', authMiddleware, seminarsController.createSeminar);
router.put('/:id', authMiddleware, seminarsController.updateSeminar);
router.delete('/:id', authMiddleware, seminarsController.deleteSeminar);

module.exports = router;