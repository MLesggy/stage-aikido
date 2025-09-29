const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/password-reset.controller');

// Route pour demander une réinitialisation de mot de passe
router.post('/request', passwordResetController.requestReset);
// Route pour vérifier la validité d'un token
router.post('/verify', passwordResetController.verifyToken);
// Route pour effectuer la réinitialisation du mot de passe
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;