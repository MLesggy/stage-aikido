const { danGradesModel } = require('../models');

// Service pour gérer la logique métier liée aux danGrades
class DanGradesService {
  // Récupérer toutes les danGrades
  async getAllDanGrades() {
    try {
      return await danGradesModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des danGrades: ${error.message}`);
    }
  }

  // Récupérer une danGrade par ID
  async getDanGradeById(id) {
    try {
      const danGrade = await danGradesModel.findById(id);
      if (!danGrade) {
        throw new Error('DanGrade non trouvée');
      }
      return danGrade;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la danGrade: ${error.message}`);
    }
  }

  // Créer une nouvelle danGrade
  async createDanGrade(danGradesData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await danGradesModel.create(danGradesData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la danGrade: ${error.message}`);
    }
  }

  // Mettre à jour une danGrade
  async updateDanGrade(id, danGradesData) {
    try {
      const danGrade = await danGradesModel.findById(id);
      if (!danGrade) {
        throw new Error('DanGrade non trouvée');
      }
      
      return await danGradesModel.update(id, danGradesData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la danGrade: ${error.message}`);
    }
  }

  // Supprimer une danGrade
  async deleteDanGrade(id) {
    try {
      const danGrade = await danGradesModel.findById(id);
      if (!danGrade) {
        throw new Error('DanGrade non trouvée');
      }
      
      return await danGradesModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la danGrade: ${error.message}`);
    }
  }
}

module.exports = new DanGradesService();