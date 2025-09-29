const { passwordResetModel, adminsModel } = require("../models");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Service for passwordResetService
class PasswordResetService {
  // Génère un token temporaire pour réinitialiser le mot de passe
  async getTemporaryToken(req) {
    try {
      const { email } = req.body;

      const admin = await passwordResetModel.findAdminByEmail(email);
      if (!admin) {
        throw new Error("No administrator found with this email");
      }

      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 900000); // 15 minutes

      await passwordResetModel.storeResetToken({
        userId: admin.admin_id,
        token: token,
        expiresAt: expiresAt,
      });

      return {
        token,
        email: admin.admin_email,
        expiresIn: "15min",
        admin: {
          admin_id: admin.admin_id,
          admin_email: admin.admin_email,
        },
      };
    } catch (error) {
      console.error("Error while generating password reset token:", error);
      throw error;
    }
  }

  // Vérifie si un token est valide
  async verifyToken(token) {
    try {
      return await passwordResetModel.validateToken(token);
    } catch (error) {
      console.error("Error while verifying token:", error);
      throw error;
    }
  }

  // Réinitialise le mot de passe avec un token
  async resetPassword(data) {
    try {
      const { token, password } = data;

      if (!token || !password) {
        const error = new Error("Token et nouveau mot de passe requis");
        error.status = 400;
        throw error;
      }

      // Vérifier le token
      const tokenData = await this.verifyToken(token);
      if (!tokenData) {
        const error = new Error("Token invalide ou expiré");
        error.status = 400;
        throw error;
      }

      // Vérifier la validité du nouveau mot de passe
      this.validatePasswordStrength(password);

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mise à jour du mot de passe
      const adminId = tokenData.adminId;
      const updatedAdmin = await adminsModel.findByIdAndUpdatePassword(
        adminId,
        { password: hashedPassword }
      );

      if (!updatedAdmin) {
        const error = new Error("Administrateur non trouvé");
        error.status = 404;
        throw error;
      }

      // Marquer le token comme utilisé
      await passwordResetModel.markTokenAsUsed(token);

      return {
        success: true,
        message: "Mot de passe réinitialisé avec succès",
        admin: {
          admin_id: updatedAdmin.admin_id,
          admin_email: updatedAdmin.admin_email
        }
      };
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      
      if (!error.status) {
        error.status = 500;
        error.message = "Erreur serveur lors de la réinitialisation du mot de passe";
      }
      
      throw error;
    }
  }

  // Validation de la complexité du mot de passe (commentée en développement)
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

module.exports = new PasswordResetService();