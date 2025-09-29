const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require('path');

// Récupérez votre clé secrète 

const RSA_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../../config/keys/private_key.pem'));

const authMiddleware = (req, res, next) => {
  // 1. Récupérer le token du header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Aucun token fourni' });
  }
  
  // Le format attendu est "Bearer [token]"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Format de token invalide' });
  }
  
  const token = parts[1];
  
  // 2. Vérifier la validité du token
  try {
    const decoded = jwt.verify(token, RSA_PRIVATE_KEY);
    
    // 3. Attacher les informations décodées à la requête pour usage ultérieur
    req.user = decoded;
    
    // 4. Continuer vers la prochaine étape
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expiré' });
    } else {
      return res.status(401).json({ message: 'Token invalide' });
    }
  }
};

module.exports = authMiddleware;