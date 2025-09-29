const bcrypt = require("bcrypt");
const { adminsModel } = require('../models');

// Service for emailChangeService
class EmailChangeService {

  // Change l'email d'un admin connecté
  async changeEmail(req) {
    const { email, id } = req.body;

    // Vérification des paramètres requis
    if (!email || !id) {
      throw { status: 400, message: "Email et nouvel adresse mail sont requis" };
    }
    
    try {
      // Mettre à jour le mail de l'administrateur
      await adminsModel.findByIdAndUpdateEmail(email, id);
      
      return {
        success: true,
        message: "Adresse mail mise à jour avec succès"
      };
      
    } catch (error) {
      console.error("Erreur lors du changement de l'addresse mail:", error);
      throw error;
    }
  }
}

module.exports = new EmailChangeService();
