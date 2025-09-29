const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login.controller');

// Routes pour les logins
router.post('/', loginController.logAdmin);

module.exports = router;