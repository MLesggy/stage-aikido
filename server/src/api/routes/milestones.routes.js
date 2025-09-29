const express = require('express');
const router = express.Router();
const milestonesController = require('../controllers/milestones.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes for milestones
router.get('/', milestonesController.getAllMilestones);
router.get('/:id', milestonesController.getMilestoneById);
router.post('/', authMiddleware, milestonesController.createMilestone);
router.put('/:id', authMiddleware, milestonesController.updateMilestone);
router.delete('/:id', authMiddleware, milestonesController.deleteMilestone);

module.exports = router;