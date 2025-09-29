const bcrypt = require("bcrypt");
const { adminsModel } = require("../models");

// Service for passwordChangeService
class PasswordChangeService {

  // Change le mot de passe d'un utilisateur connecté
  async changePassword(req) {
    const { email, oldPassword, newPassword } = req.body;

    // Vérification des paramètres requis
    if (!email || !oldPassword || !newPassword) {
      throw { status: 400, message: "Email, mot de passe actuel et nouveau mot de passe sont requis" };
    }
    
    try {
      // Vérifier la validité du nouveau mot de passe
      this.validatePasswordStrength(newPassword);
      
      // Récupérer l'admin par son email
      const admin = await adminsModel.findByEmail(email);
      
      if (!admin) {
        throw { status: 404, message: "Administrateur non trouvé" };
      }
      
      // Vérifier que le mot de passe actuel est correct
      const isPasswordValid = await bcrypt.compare(oldPassword, admin.admin_password);
      
      if (!isPasswordValid) {
        throw { status: 401, message: "Mot de passe actuel incorrect" };
      }
      
      // Hacher le nouveau mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Mettre à jour le mot de passe de l'administrateur
      await adminsModel.updatePassword(email, hashedPassword);
      
      return {
        success: true,
        message: "Mot de passe mis à jour avec succès"
      };
      
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      throw error;
    }
  }

  // Validation de la complexité du mot de passe
  validatePasswordStrength(password) {
    if (password.length < 8) {
      throw { status: 400, message: "Le mot de passe doit contenir au moins 8 caractères" };
    }
    
    if (!/[A-Z]/.test(password)) {
      throw { status: 400, message: "Le mot de passe doit contenir au moins une lettre majuscule" };
    }
    
    if (!/[a-z]/.test(password)) {
      throw { status: 400, message: "Le mot de passe doit contenir au moins une lettre minuscule" };
    }
    
    if (!/\d/.test(password)) {
      throw { status: 400, message: "Le mot de passe doit contenir au moins un chiffre" };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      throw { status: 400, message: "Le mot de passe doit contenir au moins un caractère spécial" };
    }
  }
}

module.exports = new PasswordChangeService();
