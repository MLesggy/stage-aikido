const { homeDataModel } = require('../models');

class HomeDataService {
  // Récupère la seule entrée (pas besoin d'ID)
  async getHomeData() {
    try {
      const result = await homeDataModel.find();
      if (!result) throw new Error('Aucune donnée trouvée');
      return result;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération : ${error.message}`);
    }
  }

  // Met à jour l'unique entrée (pas besoin d'ID en paramètre)
  async updateHomeData(homeData) {
    try {
      // Vérification des données requises
      if (!homeData.home_data_title || !homeData.home_data_subtitle || 
          !homeData.home_data_video_url || !homeData.image_id) {
        throw new Error('Tous les champs sont obligatoires');
      }

      return await homeDataModel.update(homeData);
    } catch (error) {
      throw new Error(`Erreur lors de la mise à jour : ${error.message}`);
    }
  }
}

module.exports = new HomeDataService();
