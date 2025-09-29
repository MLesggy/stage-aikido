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
    console.error('Erreur de connexion à la base de données:', err.message);
  });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};