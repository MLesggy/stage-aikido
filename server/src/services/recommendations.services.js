const { recommendationsModel } = require('../models');

// Service pour gérer la logique métier liée aux recommendations
class RecommendationsService {
  // Récupérer toutes les recommendations
  async getAllRecommendations() {
    try {
      return await recommendationsModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des recommendations: ${error.message}`);
    }
  }

  // Récupérer une recommendation par ID
  async getRecommendationById(id) {
    try {
      const recommendation = await recommendationsModel.findById(id);
      if (!recommendation) {
        throw new Error('Recommendation non trouvée');
      }
      return recommendation;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la recommendation: ${error.message}`);
    }
  }

  // Créer une nouvelle recommendation
  async createRecommendation(recommendationsData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await recommendationsModel.create(recommendationsData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la recommendation: ${error.message}`);
    }
  }

  // Mettre à jour une recommendation
  async updateRecommendation(id, recommendationsData) {
    try {
      const recommendation = await recommendationsModel.findById(id);
      if (!recommendation) {
        throw new Error('Recommendation non trouvée');
      }
      
      return await recommendationsModel.update(id, recommendationsData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la recommendation: ${error.message}`);
    }
  }

  // Supprimer une recommendation
  async deleteRecommendation(id) {
    try {
      const recommendation = await recommendationsModel.findById(id);
      if (!recommendation) {
        throw new Error('Recommendation non trouvée');
      }
      
      return await recommendationsModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la recommendation: ${error.message}`);
    }
  }
}

module.exports = new RecommendationsService();