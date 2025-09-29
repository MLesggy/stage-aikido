const { divRelevanceModel } = require('../models');

// Service for divRelevances
class DivRelevanceService {
  // Getting all divRelevances
  async getAllDivRelevances() {
    try {
      return await divRelevanceModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting divRelevances: ${error.message}`);
    }
  }

  // Getting a divRelevance by ID
  async getDivRelevanceById(id) {
    try {
      const divRelevance = await divRelevanceModel.findById(id);
      if (!divRelevance) {
        throw new Error('divRelevance not found');
      }
      return divRelevance;
    } catch (error) {
      throw new Error(`Error while getting divRelevance: ${error.message}`);
    }
  }

  // Creating a divRelevance
  async createDivRelevance(divRelevanceData) {
    try {
      // May add logic here
      return await divRelevanceModel.create(divRelevanceData);
    } catch (error) {
      throw new Error(`Error while creating divRelevance: ${error.message}`);
    }
  }

  // Updating a divRelevance
  async updateDivRelevance(id, divRelevanceData) {
    try {
      const divRelevance = await divRelevanceModel.findById(id);
      if (!divRelevance) {
        throw new Error('divRelevance not found');
      }
      
      // May add logic here
      return await divRelevanceModel.update(id, divRelevanceData);
    } catch (error) {
      throw new Error(`Error while updating divRelevance: ${error.message}`);
    }
  }

  // Deleting a divRelevance
  async deleteDivRelevance(id) {
    try {
      const divRelevance = await divRelevanceModel.findById(id);
      if (!divRelevance) {
        throw new Error('divRelevance not found');
      }
      
      return await divRelevanceModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting divRelevance: ${error.message}`);
    }
  }

}

module.exports = new DivRelevanceService();