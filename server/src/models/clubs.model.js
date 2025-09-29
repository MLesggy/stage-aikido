module.exports = (db) => {
  // Get all club in table
  const findAll = async () => {
    const query = `
    SELECT * from clubs
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get club for given id
  const findById = async (id) => {
    const query = `
      SELECT * FROM clubs
      WHERE club_id = $1 
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Create club
  const create = async (clubData) => {
    const { 
      club_name, 
      club_contact_name, 
      club_contact_phone, 
      club_contact_email, 
      address_id 
    } = clubData;

    const query = `
      INSERT INTO clubs (
        club_name, club_contact_name, club_contact_phone, 
        club_contact_email, address_id
      ) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    
    try {
      const values = [
        club_name, 
        club_contact_name, 
        club_contact_phone, 
        club_contact_email, 
        address_id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Update club
  const update = async (id, clubData) => {
    const { 
      club_name, 
      club_contact_name, 
      club_contact_phone, 
      club_contact_email, 
      address_id 
    } = clubData;

    const query = `
      UPDATE clubs 
      SET club_name = $1, 
          club_contact_name = $2, 
          club_contact_phone = $3, 
          club_contact_email = $4, 
          address_id = $5
      WHERE club_id = $6 
      RETURNING *
    `;
    
    try {
      const values = [
        club_name, 
        club_contact_name, 
        club_contact_phone, 
        club_contact_email, 
        address_id,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Delete club
  const remove = async (id) => {
    const query = 'DELETE FROM clubs WHERE club_id = $1 RETURNING *';
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
    create,
    update,
    remove
  };
};