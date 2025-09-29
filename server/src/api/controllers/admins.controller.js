const adminsService = require('../../services/admins.services');

// Contrôleur pour gérer les requêtes API liées aux admins
class AdminsController {
  // GET /api/admins
  async getAllAdmins(req, res) {
    try {
      const admins = await adminsService.getAllAdmins();
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/admins/:id
  async getAdminById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const admin = await adminsService.getAdminById(id);
      res.status(200).json(admin);
    } catch (error) {
      if (error.message === 'Admin non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/admins
  async createAdmin(req, res) {
    try {
      const newAdmin = await adminsService.createAdmin(req.body);
      res.status(201).json(newAdmin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/admins/:id
  async updateAdmin(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedAdmin = await adminsService.updateAdmin(id, req.body);
      res.status(200).json(updatedAdmin);
    } catch (error) {
      if (error.message === 'Admin non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/admins/:id
  async deleteAdmin(req, res) {
    try {
      const id = parseInt(req.params.id);
      await adminsService.deleteAdmin(id);
      res.status(200).json({ message: 'Admin supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Admin non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AdminsController();