// Configuration générale de l'application
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 10000,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  // Configuration pour le service d'email
  EMAIL: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // Conversion en booléen
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM
  },
  // URL du frontend pour les liens dans les emails
  FRONTEND_URL: process.env.FRONTEND_URL
};