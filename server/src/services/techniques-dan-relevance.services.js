const { techniquesDanRelevanceModel } = require('../models');

// Service pour gérer la logique métier liée aux techniquesDanRelevance
class TechniquesDanRelevanceService {
  // Récupérer toutes les techniquesDanRelevance
  async getAllTechniquesDanRelevance() {
    try {
      return await techniquesDanRelevanceModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des techniquesDanRelevance: ${error.message}`);
    }
  }

  // Récupérer une techniqueDanRelevance par ID
  async getTechniqueDanRelevanceById(id) {
    try {
      const techniqueDanRelevance = await techniquesDanRelevanceModel.findById(id);
      if (!techniqueDanRelevance) {
        throw new Error('Technique non trouvée');
      }
      return techniqueDanRelevance;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la techniqueDanRelevance: ${error.message}`);
    }
  }

  // Créer une nouvelle techniqueDanRelevance
  async createTechniqueDanRelevance(techniqueDanRelevanceData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await techniquesDanRelevanceModel.create(techniqueDanRelevanceData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la techniqueDanRelevance: ${error.message}`);
    }
  }

  // Supprimer une techniqueDanRelevance
  async deleteTechniqueDanRelevance(id) {
    try {
      const techniqueDanRelevance = await techniquesDanRelevanceModel.findById(id);
      if (!techniqueDanRelevance) {
        throw new Error('techniqueDanRelevance non trouvée');
      }
      
      return await techniquesDanRelevanceModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la techniqueDanRelevance: ${error.message}`);
    }
  }

    async replaceAllAssociations(techniqueId, danGradeIds) {
    try {
      if (!techniqueId || !Array.isArray(danGradeIds)) {
        throw new Error('Paramètres invalides');
      }

      return await techniquesDanRelevanceModel.replaceAllForTechnique(
        techniqueId,
        danGradeIds
      );
    } catch (error) {
      throw new Error(`Failed to replace associations: ${error.message}`);
    }
  }
}

module.exports = new TechniquesDanRelevanceService();