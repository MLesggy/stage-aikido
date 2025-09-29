const express = require('express');
const router = express.Router();
const homeDataController = require('../controllers/home-data.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Routes pour la configuration de la page d'accueil
 * - Une seule entrée gérée sans paramètre ID
 * - Suppression désactivée pour la cohérence métier
 */
router.get('/', homeDataController.getHomeData);
router.put('/', authMiddleware, homeDataController.updateHomeData);

// Routes désactivées (commentées pour référence) :
// router.post('/', authMiddleware, homeDataController.createHomeData); // Non nécessaire (le PUT crée si inexistant)
// router.delete('/:id', authMiddleware, homeDataController.deleteHomeData); // Non souhaité d'après le besoin

module.exports = router;