const emailChangeService = require('../../services/email-change.services');

// Contrôleur pour gérer les requêtes API liées au changement de mail
class EmailChangeController {

  // POST /api/emailChange
  async changeEmail(req, res) {
    try {
      const result = await emailChangeService.changeEmail(req);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

}

module.exports = new EmailChangeController();