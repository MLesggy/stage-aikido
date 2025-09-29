const { workFormsModel } = require('../models');

// Service pour gérer la logique métier liée aux workForms
class WorkFormsService {
  // Récupérer toutes les workForms
  async getAllWorkForms() {
    try {
      return await workFormsModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des workForms: ${error.message}`);
    }
  }

  // Récupérer une workForm par ID
  async getWorkFormById(id) {
    try {
      const workForm = await workFormsModel.findById(id);
      if (!workForm) {
        throw new Error('WorkForm non trouvée');
      }
      return workForm;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la workForm: ${error.message}`);
    }
  }

  // Créer une nouvelle workForm
  async createWorkForm(workFormsData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await workFormsModel.create(workFormsData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la workForm: ${error.message}`);
    }
  }

  // Mettre à jour une workForm
  async updateWorkForm(id, workFormsData) {
    try {
      const workForm = await workFormsModel.findById(id);
      if (!workForm) {
        throw new Error('WorkForm non trouvée');
      }
      
      return await workFormsModel.update(id, workFormsData.workForm);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la workForm: ${error.message}`);
    }
  }

  // Supprimer une workForm
  async deleteWorkForm(id) {
    try {
      const workForm = await workFormsModel.findById(id);
      if (!workForm) {
        throw new Error('WorkForm non trouvée');
      }
      
      return await workFormsModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la workForm: ${error.message}`);
    }
  }
}

module.exports = new WorkFormsService();