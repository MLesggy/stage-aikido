const { linksModel } = require('../models');

// Service for links
class LinksService {
  // Get all links in table
  async getAllLinks() {
    try {
      return await linksModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting links: ${error.message}`);
    }
  }

  // Get link for given id
  async getLinkById(id) {
    try {
      const link = await linksModel.findById(id);
      if (!link) {
        throw new Error('Link not found');
      }
      return link;
    } catch (error) {
      throw new Error(`Error while getting link: ${error.message}`);
    }
  }

    // Get all links for given club_id
  async getLinksByClubId(club_id) {
    try {
      return await linksModel.findByClubId(club_id);
    } catch (error) {
      throw new Error(`Error while getting links for club_id:${club_id}: ${error.message}`);
    }
  }

    // Get all links for given seminar_id
  async getLinksBySeminarId(seminar_id) {
    try {
      return await linksModel.findBySeminarId(seminar_id);
    } catch (error) {
      throw new Error(`Error while getting links for seminar_id:${seminar_id}: ${error.message}`);
    }
  }

  // Create new link
  async createLink(linksData) {
    try {
      //may add logic here
      return await linksModel.create(linksData);
    } catch (error) {
      throw new Error(`Error while creating link: ${error.message}`);
    }
  }

  // Updating link for given id
  async updateLink(id, linksData) {
    try {
      const link = await linksModel.findById(id);
      if (!link) {
        throw new Error('Link not found');
      }
      
      return await linksModel.update(id, linksData);
    } catch (error) {
      throw new Error(`Error while updating link: ${error.message}`);
    }
  }

  // Deleting link
  async deleteLink(id) {
    try {
      const link = await linksModel.findById(id);
      if (!link) {
        throw new Error('Link not found');
      }
      
      return await linksModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting link: ${error.message}`);
    }
  }
}

module.exports = new LinksService();