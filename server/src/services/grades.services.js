const { gradesModel } = require('../models');

// Service pour gérer la logique métier liée aux grades
class GradesService {
  // Récupérer toutes les grades
  async getAllGrades() {
    try {
      return await gradesModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des grades: ${error.message}`);
    }
  }

  // Récupérer une grade par ID
  async getGradeById(id) {
    try {
      const grade = await gradesModel.findById(id);
      if (!grade) {
        throw new Error('Grade non trouvée');
      }
      return grade;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la grade: ${error.message}`);
    }
  }

  // Créer une nouvelle grade
  async createGrade(gradesData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await gradesModel.create(gradesData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la grade: ${error.message}`);
    }
  }

  // Mettre à jour une grade
  async updateGrade(id, gradesData) {
    try {
      const grade = await gradesModel.findById(id);
      if (!grade) {
        throw new Error('Grade non trouvée');
      }
      
      return await gradesModel.update(id, gradesData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la grade: ${error.message}`);
    }
  }

  // Supprimer une grade
  async deleteGrade(id) {
    try {
      const grade = await gradesModel.findById(id);
      if (!grade) {
        throw new Error('Grade non trouvée');
      }
      
      return await gradesModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la grade: ${error.message}`);
    }
  }
}

module.exports = new GradesService();