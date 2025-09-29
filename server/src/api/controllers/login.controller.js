const loginService = require('../../services/logins.services');

// Contrôleur pour gérer les requêtes API liées au login
class LoginController {

  // POST /api/login
  async logAdmin(req, res) {
    try {
      const token = await loginService.logAdminByEmail(req);
      res.status(200).json(token);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new LoginController();