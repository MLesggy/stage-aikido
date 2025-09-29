const express = require('express');
const router = express.Router();
const gradesController = require('../controllers/grades.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les grades
router.get('/', gradesController.getAllGrades);
router.get('/:id', gradesController.getGradeById);
router.post('/', authMiddleware, gradesController.createGrade);
router.put('/:id', authMiddleware, gradesController.updateGrade);
router.delete('/:id', authMiddleware, gradesController.deleteGrade);

module.exports = router;