const attackFormsDanRelevanceService = require('../../services/attack-forms-dan-relevance.services');

// Contrôleur pour gérer les requêtes API liées aux attackFormsDanRelevance
class AttackFormsDanRelevanceController {
  // GET /api/attackFormsDanRelevance
  async getAllAttackFormsDanRelevance(req, res) {
    try {
      const attackFormsDanRelevance = await attackFormsDanRelevanceService.getAllAttackFormsDanRelevance();
      res.status(200).json(attackFormsDanRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/attackFormsDanRelevance/:attackFormId/:danGradeId
  async getAttackFormDanRelevanceById(req, res) {
    try {
      const id = {
        attack_form_id: parseInt(req.params.attackFormId),
        dan_grade_id: parseInt(req.params.danGradeId)
      };
      
      const attackFormDanRelevance = await attackFormsDanRelevanceService.getAttackFormDanRelevanceById(id);
      
      if (!attackFormDanRelevance) {
        return res.status(404).json({ message: 'AttackFormDanRelevance non trouvée' });
      }
      
      res.status(200).json(attackFormDanRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/attackFormsDanRelevance
  async createAttackFormDanRelevance(req, res) {
    try {
      const newAttackFormDanRelevance = await attackFormsDanRelevanceService.createAttackFormDanRelevance(req.body);
      res.status(201).json(newAttackFormDanRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/attackFormsDanRelevance/:attackFormId (attention! ca prend bien un attackFormId et non un attackFormDanRElevanceId car on modifie toutes les association pour un attackFormId donné)
async updateAttackFormDanRelevance(req, res) {
  try {
    const attackFormId = parseInt(req.params.attackFormId);
    const { danGradeIds } = req.body;

    console.log(attackFormId);
    console.log(danGradeIds);

    // Validation de base
    if (isNaN(attackFormId) || !Array.isArray(danGradeIds)) {
      return res.status(400).json({ 
        error: 'Requête invalide',
        details: 'attackFormId doit être un nombre et danGradeIds doit être un tableau'
      });
    }

    const result = await attackFormsDanRelevanceService.replaceAllAssociations(
      attackFormId,
      danGradeIds
    );

    res.status(200).json({
      success: true,
      attackFormId,
      updatedAssociations: result.map(r => r.dan_grade_id),
      count: result.length
    });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/attackFormsDanRelevance/:attackFormId/:danGradeId
  async deleteAttackFormDanRelevance(req, res) {
    try {
      const id = {
        attack_form_id: parseInt(req.params.attackFormId),
        dan_grade_id: parseInt(req.params.danGradeId)
      };
      
      const deleted = await attackFormsDanRelevanceService.deleteAttackFormDanRelevance(id);
      
      if (!deleted) {
        return res.status(404).json({ message: 'AttackFormDanRelevance non trouvée' });
      }
      
      res.status(200).json({ message: 'AttackFormDanRelevance supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AttackFormsDanRelevanceController();