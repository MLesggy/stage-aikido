module.exports = (db) => {
  // Get an admin with given email
  const findAdminByEmail = async (email) => {
    const query = `
      SELECT * FROM admin
      WHERE admin_email = $1
    `;
    try {
      const result = await db.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Update admin's password by email
  const updatePassword = async (email, hashedPassword) => {
    const query = `
      UPDATE admin 
      SET admin_password = $1 
      WHERE admin_email = $2 
      RETURNING admin_id, admin_email
    `;
    
    try {
      const result = await db.query(query, [hashedPassword, email]);
      
      if (result.rows.length === 0) {
        throw new Error('Failed to update admin password');
      }
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  return {
    findAdminByEmail,
    updatePassword
  };
};
