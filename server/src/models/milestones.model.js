module.exports = (db) => {
  // Récupérer tous les jalons
  const findAll = async () => {
    const query = `
      SELECT *
      FROM milestones
      ORDER BY milestone_title
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un jalon par ID
  const findById = async (id) => {
    const query = `
      SELECT *
      FROM milestones
      WHERE milestone_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un jalon par titre
  const findByTitle = async (title) => {
    const query = `
      SELECT *
      FROM milestones
      WHERE milestone_title = $1
    `;
    try {
      const result = await db.query(query, [title]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer un nouveau jalon
  const create = async (milestoneData) => {
    const { milestone_title } = milestoneData;

    const query = `
      INSERT INTO milestones (
        milestone_title
      ) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const values = [milestone_title];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour un jalon
  const update = async (id, milestoneData) => {
    const { milestone_title } = milestoneData;

    const query = `
      UPDATE milestones 
      SET milestone_title = $1
      WHERE milestone_id = $2 
      RETURNING *
    `;
    
    try {
      const values = [
        milestone_title,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer un jalon
  const remove = async (id) => {
    const query = 'DELETE FROM milestones WHERE milestone_id = $1 RETURNING *';
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
    findByTitle,
    create,
    update,
    remove
  };
};