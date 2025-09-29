const express = require('express');
const router = express.Router();
const adminsController = require('../controllers/admins.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Routes pour les techniques
router.get('/', adminsController.getAllAdmins);
router.get('/:id', adminsController.getAdminById);
router.post('/', authMiddleware, adminsController.createAdmin);
router.put('/:id', authMiddleware, adminsController.updateAdmin);
router.delete('/:id', authMiddleware, adminsController.deleteAdmin);

module.exports = router;