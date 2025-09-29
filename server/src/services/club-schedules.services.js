const { clubSchedulesModel } = require('../models');

// Service pour gérer la logique métier liée aux clubSchedules
class ClubSchedulesService {
  // Récupérer toutes les clubSchedules
  async getAllClubSchedules() {
    try {
      return await clubSchedulesModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des clubSchedules: ${error.message}`);
    }
  }

  // Récupérer les horaires par ID de club
  async getClubSchedulesByClubId(clubId) {
    try {
      return await clubSchedulesModel.findByClubId(clubId);
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des horaires du club: ${error.message}`);
    }
  }

  // Récupérer une clubSchedule par ID
  async getClubScheduleById(id) {
    try {
      const clubSchedule = await clubSchedulesModel.findById(id);
      if (!clubSchedule) {
        throw new Error('ClubSchedule non trouvée');
      }
      return clubSchedule;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de clubSchedule: ${error.message}`);
    }
  }

  // Créer une nouvelle clubSchedule
  async createClubSchedule(clubSchedulesData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await clubSchedulesModel.create(clubSchedulesData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de clubSchedule: ${error.message}`);
    }
  }

  // Mettre à jour une clubSchedule
  async updateClubSchedule(id, clubSchedulesData) {
    try {
      const clubSchedule = await clubSchedulesModel.findById(id);
      if (!clubSchedule) {
        throw new Error('ClubSchedule non trouvée');
      }
      
      return await clubSchedulesModel.update(id, clubSchedulesData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de clubSchedule: ${error.message}`);
    }
  }

  // Supprimer une clubSchedule
  async deleteClubSchedule(id) {
    try {
      const clubSchedule = await clubSchedulesModel.findById(id);
      if (!clubSchedule) {
        throw new Error('ClubSchedule non trouvée');
      }
      
      return await clubSchedulesModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de clubSchedule: ${error.message}`);
    }
  }
}

module.exports = new ClubSchedulesService();