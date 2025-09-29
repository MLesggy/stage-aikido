const passwordChangeService = require('../../services/password-change.services');

// Contrôleur pour gérer les requêtes API liées au changement de mot de passe
class PasswordChangeController {

  // POST /api/passwordChange
  async changePassword(req, res) {
    try {
      const result = await passwordChangeService.changePassword(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new PasswordChangeController();