const passwordResetService = require('../../services/password-reset.services');
const emailService = require('../../services/emails.services');
const config = require('../../config/config');

// Contrôleur pour gérer les requêtes API liées à la réinitialisation de mot de passe
class PasswordResetController {

  // POST /api/passwordReset/request
  async requestReset(req, res) {
    try {
      const tokenData = await passwordResetService.getTemporaryToken(req);
      
      // Utiliser la méthode helper du service d'email pour générer l'URL
      const resetUrl = emailService.generateResetUrl(tokenData.token);
      
      // Envoi de l'email avec le lien
      await emailService.sendPasswordResetEmail({
        to: tokenData.email,
        resetUrl: resetUrl,
        expiresIn: tokenData.expiresIn || '1h'
      });
      
      // Ne renvoyez pas le token complet dans la réponse par sécurité
      res.status(200).json({ 
        message: "Email de réinitialisation envoyé avec succès",
        email: tokenData.email 
      });
    } catch (error) {
      console.error("Erreur lors de la demande de réinitialisation:", error);
      res.status(error.status || 500).json({ 
        message: error.message || "Une erreur est survenue lors de la demande de réinitialisation"
      });
    }
  }

  // POST /api/passwordReset/verify
  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token manquant" });
      }
      
      const isValid = await passwordResetService.verifyToken(token);
      
      if (!isValid) {
        return res.status(400).json({ message: "Token invalide ou expiré" });
      }
      
      res.status(200).json({ valid: true });
    } catch (error) {
      console.error("Erreur lors de la vérification du token:", error);
      res.status(error.status || 500).json({ 
        message: error.message || "Une erreur est survenue lors de la vérification du token"
      });
    }
  }

  // POST /api/passwordReset/reset
  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;
      
      if (!token || !password) {
        return res.status(400).json({ message: "Token et mot de passe requis" });
      }
      
      const result = await passwordResetService.resetPassword({ token, password });
      
      // Si le service renvoie des détails supplémentaires (comme l'email mis à jour)
      if (result && result.email) {
        // Option: envoyer un email de confirmation que le mot de passe a bien été changé
        await emailService.sendNotificationEmail({
          to: result.email,
          subject: "Votre mot de passe a été modifié",
          message: `
            <p>Bonjour,</p>
            <p>Nous vous confirmons que le mot de passe de votre compte a été modifié avec succès.</p>
            <p>Si vous n'êtes pas à l'origine de cette modification, veuillez contacter immédiatement l'administrateur système.</p>
          `
        });
      }
      
      res.status(200).json({ 
        message: "Mot de passe réinitialisé avec succès",
        updated: true
      });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      res.status(error.status || 500).json({ 
        message: error.message || "Une erreur est survenue lors de la réinitialisation du mot de passe"
      });
    }
  }
}

module.exports = new PasswordResetController();