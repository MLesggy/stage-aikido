const { Pool } = require('pg');
const config = require('./config');

// Création d'un pool de connexions PostgreSQL
const pool = new Pool(config.DATABASE);

// Test de connexion
pool.connect()
  .then(client => {
    console.log('Connexion à la base de données établie avec succès');
    client.release();
  })
  .catch(err => {
    console.error('Erreur de connexion à la base de données:');
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Configuration utilisée:', {
      host: config.DATABASE.host,
      port: config.DATABASE.port,
      database: config.DATABASE.database,
      user: config.DATABASE.user,
      // Mot de passe masqué pour la sécurité
    });
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};