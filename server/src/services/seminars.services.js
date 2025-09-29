const { seminarsModel } = require('../models');

// Service for seminars
class SeminarsService {
  // Get all seminars
  async getAllSeminars() {
    try {
      return await seminarsModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting all seminars: ${error.message}`);
    }
  }

  // Get seminar for given id
  async getSeminarById(id) {
    try {
      const seminar = await seminarsModel.findById(id);
      if (!seminar) {
        throw new Error('Seminar not found');
      }
      return seminar;
    } catch (error) {
      throw new Error(`Error while getting seminar: ${error.message}`);
    }
  }

  // Create a seminar
  async createSeminar(seminarData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await seminarsModel.create(seminarData);
    } catch (error) {
      throw new Error(`Error while creating seminar: ${error.message}`);
    }
  }

  // Update a seminar
  async updateSeminar(id, seminarData) {
    try {
      const seminar = await seminarsModel.findById(id);
      if (!seminar) {
        throw new Error('Seminar not found');
      }
      
      return await seminarsModel.update(id, seminarData);
    } catch (error) {
      throw new Error(`Error while updating seminar: ${error.message}`);
    }
  }

  // Delete a seminar
  async deleteSeminar(id) {
    try {
      const seminar = await seminarsModel.findById(id);
      if (!seminar) {
        throw new Error('Seminar not found');
      }
      
      return await seminarsModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting seminar: ${error.message}`);
    }
  }
}

module.exports = new SeminarsService();