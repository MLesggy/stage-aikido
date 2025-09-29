// Configuration générale de l'application
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 10000,
  NODE_ENV: process.env.NODE_ENV || 'production',
  DATABASE: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  // Configuration pour le service d'email
  EMAIL: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM
  },
  // URL du frontend pour les liens dans les emails
  FRONTEND_URL: process.env.CORS_ALLOWED_ORIGINS,
  // Clé privée pour JWT
  PRIVATE_KEY: process.env.PRIVATE_KEY
};