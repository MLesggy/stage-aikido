const recommendationsService = require('../../services/recommendations.services');

// Contrôleur pour gérer les requêtes API liées aux recommendations
class RecommendationsController {
  // GET /api/recommendations
  async getAllRecommendations(req, res) {
    try {
      const recommendations = await recommendationsService.getAllRecommendations();
      res.status(200).json(recommendations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/recommendations/:id
  async getRecommendationById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const recommendation = await recommendationsService.getRecommendationById(id);
      res.status(200).json(recommendation);
    } catch (error) {
      if (error.message === 'Recommendation non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/recommendations
  async createRecommendation(req, res) {
    try {
      const newRecommendation = await recommendationsService.createRecommendation(req.body);
      res.status(201).json(newRecommendation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/recommendations/:id
  async updateRecommendation(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedRecommendation = await recommendationsService.updateRecommendation(id, req.body);
      res.status(200).json(updatedRecommendation);
    } catch (error) {
      if (error.message === 'Recommendation non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/recommendations/:id
  async deleteRecommendation(req, res) {
    try {
      const id = parseInt(req.params.id);
      await recommendationsService.deleteRecommendation(id);
      res.status(200).json({ message: 'Recommendation supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Recommendation non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RecommendationsController();