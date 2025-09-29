const express = require('express');
const router = express.Router();
const clubsController = require('../controllers/clubs.controller');
const clubSchedulesController = require('../controllers/club-schedules.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les clubs
router.get('/', clubsController.getAllClubs);
router.get('/:id', clubsController.getClubById);
router.post('/', authMiddleware, clubsController.createClub);
router.put('/:id', authMiddleware, clubsController.updateClub);
router.delete('/:id', authMiddleware, clubsController.deleteClub);

// Nested routes for club-schedules
router.get('/:id/club-schedules', clubSchedulesController.getClubSchedulesByClubId);
router.get('/:id/club-schedules/:clubScheduleId', clubSchedulesController.getClubScheduleById);
router.post('/:id/club-schedules', authMiddleware, clubSchedulesController.createClubSchedule);
router.put('/:id/club-schedules/:clubScheduleId', authMiddleware, clubSchedulesController.updateClubSchedule);
router.delete('/:id/club-schedules/:clubScheduleId', authMiddleware, clubSchedulesController.deleteClubSchedule);


module.exports = router;