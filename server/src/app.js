const express = require('express');
const cors = require('cors');
const apiRoutes = require('./api/routes');

// Création de l'application Express
const app = express();

// Augmenter la limite de taille du corps des requêtes
app.use(express.json({ limit: '50mb' }));  // Pour les requêtes JSON
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Pour les formulaires

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Middleware pour parser les URL encodées
app.use(express.urlencoded({ extended: true }));

// Routes API
app.use('/api', apiRoutes);

// Route racine
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API Aikido' });
});

// Gestion des routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;