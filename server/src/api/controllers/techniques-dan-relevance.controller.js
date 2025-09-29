const techniquesDanRelevanceService = require('../../services/techniques-dan-relevance.services');

// Contrôleur pour gérer les requêtes API liées aux techniques
class TechniquesDanRelevanceController {
  // GET /api/techniquesDanRelevance
  async getAllTechniquesDanRelevance(req, res) {
    try {
      const techniquesDanRelevance = await techniquesDanRelevanceService.getAllTechniquesDanRelevance();
      res.status(200).json(techniquesDanRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/techniquesDanRelevance/:techniqueId/:danGradeId
  async getTechniqueDanRelevanceById(req, res) {
    try {
      const id = {
        technique_id: parseInt(req.params.techniqueId),
        dan_grade_id: parseInt(req.params.danGradeId)
      };
      
      const techniqueDanRelevance = await techniquesDanRelevanceService.getTechniqueDanRelevanceById(id);
      
      if (!techniqueDanRelevance) {
        return res.status(404).json({ message: 'Relation technique-dan non trouvée' });
      }
      
      res.status(200).json(techniqueDanRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/techniquesDanRelevance
  async createTechniqueDanRelevance(req, res) {
    try {
      const newTechniqueDanRelevance = await techniquesDanRelevanceService.createTechniqueDanRelevance(req.body);
      res.status(201).json(newTechniqueDanRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/techniquesDanRelevance/:techniqueId  (attention! ca prend bien un techniqueId et non un techniqueDanRelevanceId car on modifie toutes les association pour un techniqueId donné)
  async updateTechniqueDanRelevance(req, res) {
    try {
      const techniqueId = parseInt(req.params.techniqueId);
      const { danGradeIds } = req.body;

      if (isNaN(techniqueId) || !Array.isArray(danGradeIds)) {
        return res.status(400).json({ 
          error: 'Requête invalide',
          details: 'techniqueId doit être un nombre et danGradeIds doit être un tableau' 
        });
      }

      const result = await techniquesDanRelevanceService.replaceAllAssociations(
        techniqueId, 
        danGradeIds
      );

      res.status(200).json({
        success: true,
        techniqueId,
        updatedAssociations: result.map(r => r.dan_grade_id),
        count: result.length
      });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/techniquesDanRelevance/:techniqueId/:danGradeId
  async deleteTechniqueDanRelevance(req, res) {
    try {
      const id = {
        technique_id: parseInt(req.params.techniqueId),
        dan_grade_id: parseInt(req.params.danGradeId)
      };
      
      const deleted = await techniquesDanRelevanceService.deleteTechniqueDanRelevance(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Relation technique-dan non trouvée' });
      }
      
      res.status(200).json({ message: 'Relation technique-dan supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new TechniquesDanRelevanceController();