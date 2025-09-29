const { clubsModel } = require('../models');

// Service for clubs
class clubsService {
  // Get all club in table
  async getAllClubs() {
    try {
      return await clubsModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting clubs: ${error.message}`);
    }
  }

  // Get club for given id
  async getClubById(id) {
    try {
      const club = await clubsModel.findById(id);
      if (!club) {
        throw new Error('Club not found');
      }
      return club;
    } catch (error) {
      throw new Error(`Error while getting club: ${error.message}`);
    }
  }

  // Create club
  async createClub(clubData) {
    try {
      // May add logic here
      return await clubsModel.create(clubData);
    } catch (error) {
      throw new Error(`Error while creating club: ${error.message}`);
    }
  }

  // Update club for given id
  async updateClub(id, clubData) {
    try {
      const club = await clubsModel.findById(id);
      if (!club) {
        throw new Error('Club not found');
      }
      
      return await clubsModel.update(id, clubData);
    } catch (error) {
      throw new Error(`Error while updating club: ${error.message}`);
    }
  }

  // Deleting club
  async deleteClub(id) {
    try {
      const club = await clubsModel.findById(id);
      if (!club) {
        throw new Error('Club not found');
      }
      
      return await clubsModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting club: ${error.message}`);
    }
  }
}

module.exports = new clubsService();