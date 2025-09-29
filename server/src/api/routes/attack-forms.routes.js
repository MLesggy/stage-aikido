const express = require('express');
const router = express.Router();
const attackFormsController = require('../controllers/attack-forms.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les formes d'attaque
router.get('/', attackFormsController.getAllAttackForms);
router.get('/:id', attackFormsController.getAttackFormById);
router.post('/', authMiddleware, attackFormsController.createAttackForm);
router.put('/:id', authMiddleware, attackFormsController.updateAttackForm);
router.delete('/:id', authMiddleware, attackFormsController.deleteAttackForm);

module.exports = router;