module.exports = (db) => {
  // Get all address in table
  const findAll = async () => {
    const query = `
      SELECT * FROM address
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get address with given id
  const findById = async (id) => {
    const query = `
      SELECT * FROM address
      WHERE address_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Creating a new address
  const create = async (addressData) => {
    const { 
      address_street, 
      address_complement, 
      address_postal_code, 
      address_city, 
      address_country 
    } = addressData;

    const query = `
      INSERT INTO address (
        address_street, address_complement, address_postal_code,
        address_city, address_country
      ) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    
    try {
      const values = [
        address_street, 
        address_complement, 
        address_postal_code, 
        address_city, 
        address_country
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Updating an address
  const update = async (id, addressData) => {
    const { 
      address_street, 
      address_complement, 
      address_postal_code, 
      address_city, 
      address_country 
    } = addressData;

    const query = `
      UPDATE address 
      SET address_street = $1, 
          address_complement = $2, 
          address_postal_code = $3, 
          address_city = $4, 
          address_country = $5
      WHERE address_id = $6 
      RETURNING *
    `;
    
    try {
      const values = [
        address_street, 
        address_complement, 
        address_postal_code, 
        address_city, 
        address_country,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Deleting an address
  const remove = async (id) => {
    const query = 'DELETE FROM address WHERE address_id = $1 RETURNING *';
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
