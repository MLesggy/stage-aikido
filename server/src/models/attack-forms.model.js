module.exports = (db) => {
  // Récupérer toutes les formes d'attaque
  const findAll = async () => {
    const query = `
      SELECT * FROM attack_forms
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une forme d'attaque par ID
  const findById = async (id) => {
    const query = `
      SELECT * FROM attack_forms
      WHERE attack_form_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer une nouvelle forme d'attaque
  const create = async (attackFormData) => {
    const { attack_form_name } = attackFormData;

    const query = `
      INSERT INTO attack_forms (attack_form_name) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [attack_form_name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour une forme d'attaque
  const update = async (id, attackFormData) => {
    const { attack_form_name } = attackFormData;

    const query = `
      UPDATE attack_forms 
      SET attack_form_name = $1
      WHERE attack_form_id = $2 
      RETURNING *
    `;
    
    try {
      const values = [attack_form_name, id];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer une forme d'attaque
  const remove = async (id) => {
    const query = 'DELETE FROM attack_forms WHERE attack_form_id = $1 RETURNING *';
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