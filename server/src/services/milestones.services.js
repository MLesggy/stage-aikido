const { milestonesModel } = require('../models');

// Service pour gérer la logique métier liée aux milestones
class MilestonesService {
  // Récupérer toutes les milestones
  async getAllMilestones() {
    try {
      return await milestonesModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des milestones: ${error.message}`);
    }
  }

  // Récupérer une milestone par ID
  async getMilestoneById(id) {
    try {
      const milestone = await milestonesModel.findById(id);
      if (!milestone) {
        throw new Error('Milestone non trouvée');
      }
      return milestone;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la milestone: ${error.message}`);
    }
  }

  // Créer une nouvelle milestone
  async createMilestone(milestonesData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await milestonesModel.create(milestonesData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la milestone: ${error.message}`);
    }
  }

  // Mettre à jour une milestone
  async updateMilestone(id, milestonesData) {
    try {
      const milestone = await milestonesModel.findById(id);
      if (!milestone) {
        throw new Error('Milestone non trouvée');
      }
      
      return await milestonesModel.update(id, milestonesData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la milestone: ${error.message}`);
    }
  }

  // Supprimer une milestone
  async deleteMilestone(id) {
    try {
      const milestone = await milestonesModel.findById(id);
      if (!milestone) {
        throw new Error('Milestone non trouvée');
      }
      
      return await milestonesModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la milestone: ${error.message}`);
    }
  }
}

module.exports = new MilestonesService();