module.exports = (db) => {
  // Get all admins in table
  const findAll = async () => {
    const query = `
      SELECT * FROM admin
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get admin by id
  const findById = async (id) => {
    const query = `
      SELECT * FROM admin
      WHERE admin_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };
  
  // Récupérer un admin par email
  const findByEmail = async (email) => {
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

  // Mise à jour du mot de passe d'un admin par son email
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

  // Créer un nouvel admin
  const create = async (adminData) => {
    const { 
      admin_email, 
      admin_password
    } = adminData;

    const query = `
      INSERT INTO admin (
        admin_email, admin_password
      ) 
      VALUES ($1, $2) 
      RETURNING admin_id, admin_email
    `;
    
    try {
      const values = [
        admin_email, 
        admin_password
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour un admin
  const update = async (id, adminData) => {
    const { 
      admin_email, 
      admin_password 
    } = adminData;

    const query = `
      UPDATE admin 
      SET admin_email = $1, 
          admin_password = $2
      WHERE admin_id = $3 
      RETURNING admin_id, admin_email
    `;
    
    try {
      const values = [
        admin_email, 
        admin_password,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };
  
  // Trouve un admin par ID et met à jour son adresse email
  const findByIdAndUpdateEmail = async (email, id) => {
    try {
      const query = `
        UPDATE admin 
        SET admin_email = $1
        WHERE admin_id = $2
        RETURNING admin_id, admin_email
      `;
      
      const values = [
        email,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  //Trouve un admin par ID et met à jour seulement son mot de passe
  const findByIdAndUpdatePassword = async (id, updateData) => {
    try {
      const query = `
        UPDATE admin 
        SET admin_password = $1
        WHERE admin_id = $2 
        RETURNING admin_id, admin_email
      `;
      
      const values = [
        updateData.password, // On s'attend à recevoir juste un mot de passe haché
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer un admin
  const remove = async (id) => {
    const query = 'DELETE FROM admin WHERE admin_id = $1 RETURNING admin_id';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  return {
    findAll,
    findById,
    findByEmail,
    updatePassword,
    create,
    update,
    remove,
    findByIdAndUpdateEmail,
    findByIdAndUpdatePassword
  };
};
