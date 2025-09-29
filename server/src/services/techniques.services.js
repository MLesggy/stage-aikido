const { techniquesModel } = require('../models');

// Service pour gérer la logique métier liée aux techniques
class TechniquesService {
  // Récupérer toutes les techniques
  async getAllTechniques() {
    try {
      return await techniquesModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des techniques: ${error.message}`);
    }
  }

  // Récupérer une technique par ID
  async getTechniqueById(id) {
    try {
      const technique = await techniquesModel.findById(id);
      if (!technique) {
        throw new Error('Technique non trouvée');
      }
      return technique;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la technique: ${error.message}`);
    }
  }

  // Créer une nouvelle technique
  async createTechnique(techniqueData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await techniquesModel.create(techniqueData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la technique: ${error.message}`);
    }
  }

  // Mettre à jour une technique
  async updateTechnique(id, techniqueData) {
    try {
      const technique = await techniquesModel.findById(id);
      if (!technique) {
        throw new Error('Technique non trouvée');
      }

      return await techniquesModel.update(id, techniqueData.technique);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la technique: ${error.message}`);
    }
  }

  // Supprimer une technique
  async deleteTechnique(id) {
    try {
      const technique = await techniquesModel.findById(id);
      if (!technique) {
        throw new Error('Technique non trouvée');
      }
      
      return await techniquesModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la technique: ${error.message}`);
    }
  }
}

module.exports = new TechniquesService();