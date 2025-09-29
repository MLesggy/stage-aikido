module.exports = (db) => {
  // Find an admin with given email
  const findAdminByEmail = async (email) => {
    console.log(email);
    const query = `
      SELECT admin_id, admin_email 
      FROM admin
      WHERE admin_email = $1
    `;
    try {
      const result = await db.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }

      return {
        admin_id: result.rows[0].admin_id,
        admin_email: result.rows[0].admin_email
      };
    } catch (error) {
      console.error('Admin not found', error);
      throw error;
    }
  };

  // Stocke a reset token
  const storeResetToken = async ({ userId, token, expiresAt }) => {
    const query = `
      INSERT INTO password_reset_tokens (
        password_reset_token_admin_id,
        password_reset_token_token,
        password_reset_token_expires_at,
        password_reset_tokens_used
      )
      VALUES ($1, $2, $3, false)
      RETURNING 
        password_reset_token_id,
        password_reset_token_token,
        password_reset_token_expires_at
    `;
    
    try {
      const result = await db.query(query, [userId, token, expiresAt]);
      
      return {
        id: result.rows[0].password_reset_token_id,
        token: result.rows[0].password_reset_token_token,
        expiresAt: result.rows[0].password_reset_token_expires_at
      };
    } catch (error) {
      console.error('Error while stocking reset token', error);
      throw error;
    }
  };

  // Check if the token is valid (not expired and not used)
  const validateToken = async (token) => {
    const query = `
      SELECT 
        password_reset_token_id,
        password_reset_token_admin_id,
        password_reset_tokens_used
      FROM password_reset_tokens
      WHERE 
        password_reset_token_token = $1 AND
        password_reset_token_expires_at > NOW() AND
        password_reset_tokens_used = false
    `;
    
    try {
      const result = await db.query(query, [token]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return {
        tokenId: result.rows[0].password_reset_token_id,
        adminId: result.rows[0].password_reset_token_admin_id,
        used: result.rows[0].password_reset_tokens_used
      };
    } catch (error) {
      console.error('Error while validating token', error);
      throw error;
    }
  };

  // Mark the given token to used
  const markTokenAsUsed = async (token) => {
    const query = `
      UPDATE password_reset_tokens
      SET password_reset_tokens_used = true
      WHERE password_reset_token_token = $1
      RETURNING password_reset_token_id
    `;
    
    try {
      const result = await db.query(query, [token]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error while marking given token to used:', error);
      throw error;
    }
  };

  return {
    findAdminByEmail,
    storeResetToken,
    validateToken,
    markTokenAsUsed
  };
};