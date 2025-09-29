const express = require('express');
const router = express.Router();
const workFormsController = require('../controllers/work-forms.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les formes de travail
router.get('/', workFormsController.getAllWorkForms);
router.get('/:id', workFormsController.getWorkFormById);
router.post('/', authMiddleware, workFormsController.createWorkForm);
router.put('/:id', authMiddleware, workFormsController.updateWorkForm);
router.delete('/:id', authMiddleware, workFormsController.deleteWorkForm);

module.exports = router;