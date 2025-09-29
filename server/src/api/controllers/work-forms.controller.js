const workFormsService = require('../../services/work-forms.services');

// Contrôleur pour gérer les requêtes API liées aux workForms
class WorkFormsController {
  // GET /api/workForms
  async getAllWorkForms(req, res) {
    try {
      const workForms = await workFormsService.getAllWorkForms();
      res.status(200).json(workForms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/workForms/:id
  async getWorkFormById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const workForm = await workFormsService.getWorkFormById(id);
      res.status(200).json(workForm);
    } catch (error) {
      if (error.message === 'WorkForm non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/workForms
  async createWorkForm(req, res) {
    try {
      const newWorkForm = await workFormsService.createWorkForm(req.body);
      res.status(201).json(newWorkForm);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/workForms/:id
  async updateWorkForm(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedWorkForm = await workFormsService.updateWorkForm(id, req.body);
      res.status(200).json(updatedWorkForm);
    } catch (error) {
      if (error.message === 'WorkForm non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/workForms/:id
  async deleteWorkForm(req, res) {
    try {
      const id = parseInt(req.params.id);
      await workFormsService.deleteWorkForm(id);
      res.status(200).json({ message: 'WorkForm supprimée avec succès' });
    } catch (error) {
      if (error.message === 'WorkForm non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new WorkFormsController();