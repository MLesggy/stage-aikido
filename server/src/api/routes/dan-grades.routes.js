const express = require('express');
const router = express.Router();
const danGradesController = require('../controllers/dan-grades.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les dan-grades
router.get('/', danGradesController.getAllDanGrades);
router.get('/:id', danGradesController.getDanGradeById);
router.post('/', authMiddleware, danGradesController.createDanGrade);
router.put('/:id', authMiddleware, danGradesController.updateDanGrade);
router.delete('/:id', authMiddleware, danGradesController.deleteDanGrade);

module.exports = router;