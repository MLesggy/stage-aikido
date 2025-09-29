// require('dotenv').config({ path: '../.env' });

const app = require('./app');
const config = require('./config/config');

// Démarrage du serveur
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} en mode ${config.NODE_ENV}`);
});