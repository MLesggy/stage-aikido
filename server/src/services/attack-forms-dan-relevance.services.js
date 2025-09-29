const { attackFormsDanRelevanceModel } = require('../models');

// Service pour gérer la logique métier liée aux attackFormsDanRelevance
class AttackFormsDanRelevanceService {
  // Récupérer toutes les attackFormsDanRelevance
  async getAllAttackFormsDanRelevance() {
    try {
      return await attackFormsDanRelevanceModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des attackFormsDanRelevance: ${error.message}`);
    }
  }

  // Récupérer une attackFormDanRelevance par ID
  async getAttackFormDanRelevanceById(id) {
    try {
      const attackFormDanRelevance = await attackFormsDanRelevanceModel.findById(id);
      if (!attackFormDanRelevance) {
        throw new Error('AttackFormDanRelevance non trouvée');
      }
      return attackFormDanRelevance;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la attackFormDanRelevance: ${error.message}`);
    }
  }

  // Créer une nouvelle attackFormDanRelevance
  async createAttackFormDanRelevance(attackFormDanRelevanceData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await attackFormsDanRelevanceModel.create(attackFormDanRelevanceData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la attackFormDanRelevance: ${error.message}`);
    }
  }

  // Supprimer une attackFormDanRelevance
  async deleteAttackFormDanRelevance(id) {
    try {
      const attackFormDanRelevance = await attackFormsDanRelevanceModel.findById(id);
      if (!attackFormDanRelevance) {
        throw new Error('AttackFormDanRelevance non trouvée');
      }
      
      return await attackFormsDanRelevanceModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la attackFormDanRelevance: ${error.message}`);
    }
  }

   async replaceAllAssociations(attackFormId, danGradeIds) {
    try {
      if (!attackFormId || !Array.isArray(danGradeIds)) {
        throw new Error('Paramètres invalides');
      }

      return await attackFormsDanRelevanceModel.replaceAllForAttackForm(
        attackFormId,
        danGradeIds
      );
    } catch (error) {
      throw new Error(`Failed to replace associations: ${error.message}`);
    }
  }
}

module.exports = new AttackFormsDanRelevanceService();