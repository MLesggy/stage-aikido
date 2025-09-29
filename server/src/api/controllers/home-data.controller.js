const homeDataService = require('../../services/home-data.services');

// Contrôleur pour la gestion des données de la page d'accueil
class HomeDataController {
  /**
   * GET /api/homeData
   * Récupère l'unique entrée homeData
   */
  async getHomeData(req, res) {
    try {
      const homeData = await homeDataService.getHomeData();
      
      // Si aucune donnée n'existe (première utilisation)
      if (!homeData) {
        return res.status(404).json({ 
          message: 'Aucune donnée trouvée', 
          suggestion: 'Effectuez une requête PUT/POST pour initialiser' 
        });
      }
      
      res.status(200).json(homeData);
    } catch (error) {
      res.status(500).json({ 
        message: 'Erreur serveur',
        details: error.message 
      });
    }
  }

  /**
   * PUT /api/homeData
   * Met à jour l'unique entrée (sans paramètre ID)
   */
  async updateHomeData(req, res) {
    try {
      // Validation simplifiée
      if (!req.body.home_data_title || !req.body.home_data_subtitle) {
        return res.status(400).json({ 
          message: 'Les champs title et subtitle sont obligatoires' 
        });
      }

      const updatedData = await homeDataService.updateHomeData(req.body);
      res.status(200).json(updatedData);
    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error.message.includes('champ')) {
        return res.status(400).json({ message: error.message });
      }
      
      res.status(500).json({ 
        message: 'Échec de la mise à jour',
        details: error.message 
      });
    }
  }
}

module.exports = new HomeDataController();