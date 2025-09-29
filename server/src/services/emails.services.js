const nodemailer = require("nodemailer");
const config = require("../config/config");

/**
 * Service pour l'envoi d'emails
 * - Production: Utilise les configurations standards SMTP
 * - Développement: Utilise Maildev ou Ethereal selon la configuration
 */
class EmailService {
  constructor() {
    this.setupTransporter();
    
    // Email d'expédition par défaut
    this.defaultFrom = 
      config.EMAIL?.from || `"Admin System" <${config.EMAIL?.user || 'noreply@example.com'}>`;

    // URL du frontend pour les liens
    this.frontendUrl = config.FRONTEND_URL || 'http://localhost:4200';
    
    // Durée par défaut de validité des tokens
    this.defaultTokenValidity = '1 heure';
  }

  /**
   * Configure le transporteur d'emails selon l'environnement
   */
  async setupTransporter() {
    try {
      if (process.env.NODE_ENV === 'development') {
        // En mode développement, utiliser Maildev (s'exécute localement)
        this.transporter = nodemailer.createTransport({
          host: '127.0.0.1',
          port: 1025,  // Port par défaut de Maildev
          secure: false,
          ignoreTLS: true // Important pour Maildev
        });
        
        console.log('────────────────────────────────────────────────');
        console.log('📧 Mode développement avec Maildev activé');
        console.log('📧 Interface Web disponible sur: http://localhost:1080');
        console.log('📧 Assurez-vous que Maildev est en cours d\'exécution');
        console.log('────────────────────────────────────────────────');
      } else {
        // En mode production, utiliser les paramètres de configuration
        this.transporter = nodemailer.createTransport({
          host: config.EMAIL?.host,
          port: config.EMAIL?.port,
          secure: config.EMAIL?.secure,
          auth: {
            user: config.EMAIL?.user,
            pass: config.EMAIL?.pass,
          },
        });
        console.log('📧 Service email configuré en mode production');
      }

      // Vérifier la connexion
      await this.verifyConnection();
    } catch (error) {
      console.error('❌ Erreur lors de la configuration du service email:', error);
      // En cas d'erreur, tenter de configurer un compte Ethereal comme solution de secours
      await this.setupEtherealFallback();
    }
  }

  /**
   * Vérifie la connexion au serveur SMTP
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Connexion au serveur SMTP établie avec succès');
    } catch (error) {
      console.error('❌ Échec de connexion au serveur SMTP:', error);
      throw error;
    }
  }

  /**
   * Configuration de secours avec Ethereal si Maildev n'est pas disponible
   */
  async setupEtherealFallback() {
    try {
      console.log('🔄 Tentative de configuration avec Ethereal...');
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('────────────────────────────────────────────────');
      console.log('📧 Mode de secours avec Ethereal activé');
      console.log('📧 Compte de test:', testAccount.user);
      console.log('────────────────────────────────────────────────');
      
      this._isEtherealActive = true;
      return testAccount;
    } catch (error) {
      console.error('❌ Échec de la configuration Ethereal:', error);
      console.error('⚠️ Service email désactivé! Les emails ne seront pas envoyés');
      
      // Créer un transporteur factice qui enregistre simplement les emails dans la console
      this.transporter = {
        sendMail: (mailOptions) => {
          console.log('📧 [EMAIL SIMULÉ] Destinataire:', mailOptions.to);
          console.log('📧 [EMAIL SIMULÉ] Sujet:', mailOptions.subject);
          console.log('📧 [EMAIL SIMULÉ] Contenu:', mailOptions.text);
          return Promise.resolve({ 
            messageId: `mock_${Date.now()}`, 
            response: 'Simulated email sent' 
          });
        },
      };
    }
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   * @param {object} emailData - Données de l'email
   * @returns {object} Résultat de l'envoi
   */
  async sendPasswordResetEmail(emailData) {
    const { to, resetUrl, expiresIn = this.defaultTokenValidity } = emailData;

    // Vérification des données requises
    if (!to || !resetUrl) {
      throw new Error("Email recipient and reset URL are required");
    }

    try {
      // Préparation du message
      const mailOptions = {
        from: this.defaultFrom,
        to: to,
        subject: "Réinitialisation de votre mot de passe",
        text: `
Bonjour,

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte administrateur.

Pour réinitialiser votre mot de passe, veuillez cliquer sur le lien ci-dessous (valide pendant ${expiresIn}) :
${resetUrl}

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.

Cordialement,
L'équipe d'administration
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h2 style="color: #333; text-align: center;">Réinitialisation de votre mot de passe</h2>
  
  <p>Bonjour,</p>
  
  <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte administrateur.</p>
  
  <p>Pour réinitialiser votre mot de passe, veuillez cliquer sur le bouton ci-dessous (valide pendant ${expiresIn}) :</p>
  
  <p style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
  </p>
  
  <p>Si le bouton ne fonctionne pas, vous pouvez copier et coller le lien suivant dans votre navigateur :</p>
  
  <p style="background-color: #f5f5f5; padding: 10px; border-radius: 3px; word-break: break-all;">
    ${resetUrl}
  </p>
  
  <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
  
  <p>Cordialement,<br>L'équipe d'administration</p>
  
  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777; text-align: center;">
    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
  </div>
</div>
        `,
      };

      // Envoi de l'email
      const info = await this.transporter.sendMail(mailOptions);

      // Si nous utilisons Ethereal, fournir l'URL de prévisualisation
      const result = {
        messageId: info.messageId,
        status: "sent",
        recipient: to,
        sentAt: new Date(),
      };
      
      if (this._isEtherealActive) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('────────────────────────────────────────────────');
        console.log('📧 Email envoyé avec succès via Ethereal!');
        console.log('📧 URL de prévisualisation:', previewUrl);
        console.log('────────────────────────────────────────────────');
        result.previewUrl = previewUrl;
      } else if (process.env.NODE_ENV === 'development') {
        console.log('────────────────────────────────────────────────');
        console.log('📧 Email envoyé avec succès via Maildev!');
        console.log('📧 Vérifiez http://localhost:1080 pour voir l\'email');
        console.log('────────────────────────────────────────────────');
      }
      
      return result;
    } catch (error) {
      console.error("Error while sending password reset email:", error);
      throw error;
    }
  }

  /**
   * Méthode pour envoyer un email de notification
   * @param {object} emailData - Données de l'email
   * @returns {object} Résultat de l'envoi
   */
  async sendNotificationEmail(emailData) {
    const { to, subject, message, html } = emailData;

    // Vérification des données requises
    if (!to || !subject || (!message && !html)) {
      throw new Error("Email recipient, subject and message/html are required");
    }

    try {
      // Préparation du message
      const mailOptions = {
        from: this.defaultFrom,
        to: to,
        subject: subject,
        text: message,
        // Si HTML est fourni, l'utiliser, sinon créer un HTML basé sur le message texte
        html: html || `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
  <h2 style="color: #333; text-align: center;">${subject}</h2>
  <div style="margin: 20px 0;">
    ${message.replace(/\n/g, '<br>')}
  </div>
  <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777; text-align: center;">
    Cet email a été envoyé automatiquement, merci de ne pas y répondre.
  </div>
</div>
        `,
      };

      // Envoi de l'email
      const info = await this.transporter.sendMail(mailOptions);

      // Si nous utilisons Ethereal, fournir l'URL de prévisualisation
      const result = {
        messageId: info.messageId,
        status: "sent",
        recipient: to,
        subject: subject,
        sentAt: new Date(),
      };
      
      if (this._isEtherealActive) {
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('────────────────────────────────────────────────');
        console.log('📧 Email envoyé avec succès via Ethereal!');
        console.log('📧 URL de prévisualisation:', previewUrl);
        console.log('────────────────────────────────────────────────');
        result.previewUrl = previewUrl;
      } else if (process.env.NODE_ENV === 'development') {
        console.log('────────────────────────────────────────────────');
        console.log('📧 Email envoyé avec succès via Maildev!');
        console.log('📧 Vérifiez http://localhost:1080 pour voir l\'email');
        console.log('────────────────────────────────────────────────');
      }
      
      return result;
    } catch (error) {
      console.error("Error while sending notification email:", error);
      throw error;
    }
  }

  /**
   * Génère une URL complète de réinitialisation de mot de passe
   * @param {string} token - Token de réinitialisation
   * @returns {string} URL complète
   */
  generateResetUrl(token) {
    return `${this.frontendUrl}/reset-password?token=${token}`;
  }
}

module.exports = new EmailService();
