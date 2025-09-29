const techniquesService = require('../../services/techniques.services');

// Contrôleur pour gérer les requêtes API liées aux techniques
class TechniquesController {
  // GET /api/techniques
  async getAllTechniques(req, res) {
    try {
      const techniques = await techniquesService.getAllTechniques();
      res.status(200).json(techniques);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/techniques/:id
  async getTechniqueById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const technique = await techniquesService.getTechniqueById(id);
      res.status(200).json(technique);
    } catch (error) {
      if (error.message === 'Technique non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/techniques
  async createTechnique(req, res) {
    try {
      const newTechnique = await techniquesService.createTechnique(req.body);
      res.status(201).json(newTechnique);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/techniques/:id
  async updateTechnique(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedTechnique = await techniquesService.updateTechnique(id, req.body);
      res.status(200).json(updatedTechnique);
    } catch (error) {
      if (error.message === 'Technique non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/techniques/:id
  async deleteTechnique(req, res) {
    try {
      const id = parseInt(req.params.id);
      await techniquesService.deleteTechnique(id);
      res.status(200).json({ message: 'Technique supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Technique non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TechniquesController();