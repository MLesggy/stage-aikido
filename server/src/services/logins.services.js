const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { loginModel } = require("../models");
const path = require('path');

// Service for login
class LoginService {

  async logAdminByEmail(req) {
    const { email, password } = req.body;
    
    // Checking if we received email and password
    if (!email || !password) {
      throw new Error("Email and password required");
    }
    
    try {
      // Checking for admin in database
      const admin = await loginModel.findAdminByEmail(email);
      
      if (!admin) {
        throw new Error("Utilisateur non trouvé");
      }

      // Checking given password with database hash
      const isPasswordValid = await bcrypt.compare(password, admin.admin_password);

      if (!isPasswordValid) {
        throw new Error("Bad password");
      }
      
      // Generating JWToken using private key
      // const RSA_PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../config/keys/private_key.pem'));
      const RSA_PRIVATE_KEY = process.env.PRIVATE_KEY;

      // Creating payload with admin informations
      const payload = {
        id: admin.admin_id,
        email: admin.admin_email,
      };

      const jwtBearerToken = jwt.sign(payload, RSA_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "1h", // Maybe an environment variable ?
        subject: admin.admin_id.toString() // ID must be converted to string
      });
      
      return {
        token: jwtBearerToken,
        expiresIn: "1h",  // Maybe an environment variable ?
        admin: {
          admin_id: admin.admin_id,
          admin_email: admin.admin_email,
          admin_tokenGenerationDate: new Date(),
        }
      };
      
    } catch (error) {
      console.error("Error while generating token:", error);
      throw error;
    }
  }
}

module.exports = new LoginService();
