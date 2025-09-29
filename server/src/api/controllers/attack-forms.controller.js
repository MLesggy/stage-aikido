const attackFormsService = require('../../services/attack-forms.services');

// Contrôleur pour gérer les requêtes API liées aux attackForms
class AttackFormsController {
  // GET /api/attackForms
  async getAllAttackForms(req, res) {
    try {
      const attackForms = await attackFormsService.getAllAttackForms();
      res.status(200).json(attackForms);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/attackForms/:id
  async getAttackFormById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const attackForm = await attackFormsService.getAttackFormById(id);
      res.status(200).json(attackForm);
    } catch (error) {
      if (error.message === 'AttackForm non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/attackForms
  async createAttackForm(req, res) {
    try {
      const newAttackForm = await attackFormsService.createAttackForm(req.body);
      res.status(201).json(newAttackForm);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/attackForms/:id
  async updateAttackForm(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedAttackForm = await attackFormsService.updateAttackForm(id, req.body);
      res.status(200).json(updatedAttackForm);
    } catch (error) {
      if (error.message === 'AttackForm non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/attackForms/:id
  async deleteAttackForm(req, res) {
    try {
      const id = parseInt(req.params.id);
      await attackFormsService.deleteAttackForm(id);
      res.status(200).json({ message: 'AttackForm supprimée avec succès' });
    } catch (error) {
      if (error.message === 'AttackForm non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AttackFormsController();