module.exports = (db) => {
  // Récupérer toutes les recommandations
  const findAll = async () => {
    const query = `
      SELECT *
      FROM recommendations
      ORDER BY recommendation_id
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une recommandation par ID
  const findById = async (id) => {
    const query = `
      SELECT *
      FROM recommendations
      WHERE recommendation_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une recommandation par type
  const findByType = async (type) => {
    const query = `
      SELECT *
      FROM recommendations
      WHERE recommendation_type = $1
    `;
    try {
      const result = await db.query(query, [type]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer une nouvelle recommandation
  const create = async (recommendationData) => {
    const { recommendation_type } = recommendationData;

    const query = `
      INSERT INTO recommendations (
        recommendation_type
      ) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const values = [recommendation_type];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour une recommandation
  const update = async (id, recommendationData) => {
    const { recommendation_type } = recommendationData;

    const query = `
      UPDATE recommendations 
      SET recommendation_type = $1
      WHERE recommendation_id = $2 
      RETURNING *
    `;
    
    try {
      const values = [
        recommendation_type,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer une recommandation
  const remove = async (id) => {
    const query = 'DELETE FROM recommendations WHERE recommendation_id = $1 RETURNING *';
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
    findByType,
    create,
    update,
    remove
  };
};