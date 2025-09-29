const storiesService = require('../../services/stories.services');

// Contrôleur pour gérer les requêtes API liées aux stories
class StoriesController {
  // GET /api/stories
  async getAllStories(req, res) {
    try {
      const stories = await storiesService.getAllStories();
      res.status(200).json(stories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/stories/:id
  async getStoryById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const story = await storiesService.getStoryById(id);
      res.status(200).json(story);
    } catch (error) {
      if (error.message === 'Story non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/stories
  async createStory(req, res) {
    try {
      const newStory = await storiesService.createStory(req.body);
      res.status(201).json(newStory);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/stories/:id
  async updateStory(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedStory = await storiesService.updateStory(id, req.body);
      res.status(200).json(updatedStory);
    } catch (error) {
      if (error.message === 'Story non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/stories/:id
  async deleteStory(req, res) {
    try {
      const id = parseInt(req.params.id);
      await storiesService.deleteStory(id);
      res.status(200).json({ message: 'Story supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Story non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new StoriesController();