const express = require('express');
const router = express.Router();
const emailChangeController = require('../controllers/email-change.controller');
const authMiddleware = require('../middleware/auth.middleware');


// Route pour modifier l'email: prend un le nouveau mail et l'id de l'admin
router.post('/', authMiddleware, emailChangeController.changeEmail);

module.exports = router;