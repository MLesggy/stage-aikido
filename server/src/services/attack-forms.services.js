const { attackFormsModel } = require('../models');

// Service pour gérer la logique métier liée aux attackForms
class AttackFormsService {
  // Récupérer toutes les attackForms
  async getAllAttackForms() {
    try {
      return await attackFormsModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des attackForms: ${error.message}`);
    }
  }

  // Récupérer une attackForm par ID
  async getAttackFormById(id) {
    try {
      const attackForm = await attackFormsModel.findById(id);
      if (!attackForm) {
        throw new Error('AttackForm non trouvée');
      }
      return attackForm;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de l'attackForm: ${error.message}`);
    }
  }

  // Créer une nouvelle attackForm
  async createAttackForm(attackFormData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await attackFormsModel.create(attackFormData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de l'attackForm: ${error.message}`);
    }
  }

  // Mettre à jour une attackForm
  async updateAttackForm(id, attackFormData) {
    try {
      const attackForm = await attackFormsModel.findById(id);
      if (!attackForm) {
        throw new Error('AttackForm non trouvée');
      }
      
      return await attackFormsModel.update(id, attackFormData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de l'attackForm: ${error.message}`);
    }
  }

  // Supprimer une attackForm
  async deleteAttackForm(id) {
    try {
      const attackForm = await attackFormsModel.findById(id);
      if (!attackForm) {
        throw new Error('AttackForm non trouvée');
      }
      
      return await attackFormsModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de l'attackForm: ${error.message}`);
    }
  }
}

module.exports = new AttackFormsService();