const { storiesModel } = require('../models');

// Service pour gérer la logique métier liée aux stories
class StoriesService {
  // Récupérer toutes les stories
  async getAllStories() {
    try {
      return await storiesModel.findAll();
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des stories: ${error.message}`);
    }
  }

  // Récupérer une story par ID
  async getStoryById(id) {
    try {
      const story = await storiesModel.findById(id);
      if (!story) {
        throw new Error('Story non trouvée');
      }
      return story;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la story: ${error.message}`);
    }
  }

  // Créer une nouvelle story
  async createStory(storyData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await storiesModel.create(storyData);
    } catch (error) {
      throw new Error(`Erreur lors de la création de la story: ${error.message}`);
    }
  }

  // Mettre à jour une story
  async updateStory(id, storyData) {
    try {
      const story = await storiesModel.findById(id);
      if (!story) {
        throw new Error('Story non trouvée');
      }
      
      return await storiesModel.update(id, storyData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour de la story: ${error.message}`);
    }
  }

  // Supprimer une story
  async deleteStory(id) {
    try {
      const story = await storiesModel.findById(id);
      if (!story) {
        throw new Error('Story non trouvée');
      }
      
      return await storiesModel.remove(id);
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la story: ${error.message}`);
    }
  }
}

module.exports = new StoriesService();