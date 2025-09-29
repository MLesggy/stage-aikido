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

  return {
    findAdminByEmail
  };
};