const express = require('express');
const router = express.Router();
const passwordChangeController = require('../controllers/password-change.controller');
const authMiddleware = require('../middleware/auth.middleware');


// Route pour modifier le mot de passe: prend un password et le userToken
router.post('/', authMiddleware, passwordChangeController.changePassword);

module.exports = router;