const { imagesModel } = require('../models');

// Service for images
class ImagesService {
  // Get all images
  async getAllImages() {
    try {
      return await imagesModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting images:: ${error.message}`);
    }
  }

  // Get images for the given seminar_id
  async getImagesBySeminarId(seminar_id) {
    try {
      return await imagesModel.findBySeminarId(seminar_id);
    } catch (error) {
      throw new Error(`Error while getting seminar images:: ${error.message}`);
    }
  }

  // Get images for the given club_id
    async getImagesByClubId(club_id) {
    try {
      return await imagesModel.findByClubId(club_id);
    } catch (error) {
      throw new Error(`Error while getting club images:: ${error.message}`);
    }
  }

  // Get images for the given id
    async getImageById(id) {
    try {
      return await imagesModel.findById(id);
    } catch (error) {
      throw new Error(`Error while getting image:: ${error.message}`);
    }
  }

  // Create new image
  async createImage(imagesData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await imagesModel.create(imagesData);
    } catch (error) {
      throw new Error(`Erreur while creating image: ${error.message}`);
    }
  }

  // Update an image
  async updateImage(id, imagesData) {
    try {
      const image = await imagesModel.findById(id);
      if (!image) {
        throw new Error('Image not found');
      }
      
      return await imagesModel.update(id, imagesData);
    } catch (error) {
      throw new Error(`Error while updating image: ${error.message}`);
    }
  }

  // Delete an image
  async deleteImage(id) {
    try {
      const image = await imagesModel.findById(id);
      if (!image) {
        throw new Error('Image not found');
      }
      
      return await imagesModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting image: ${error.message}`);
    }
  }
}

module.exports = new ImagesService();