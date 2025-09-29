module.exports = (db) => {
  // Get all divRelevances
  const findAll = async () => {
    const query = `
      SELECT * FROM div_relevance
      ORDER BY div_relevance_id
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get a divRelevance by id
  const findById = async (id) => {
    const query = `
      SELECT * FROM div_relevance
      WHERE div_relevance_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Create a new divRelevance
  const create = async (divRelevanceData) => {
    const { 
      div_relevance_story_id, 
      div_relevance_image_id, 
      div_relevance_milestone_id,
    } = divRelevanceData;

    const query = `
      INSERT INTO div_relevance (
        div_relevance_story_id, 
        div_relevance_image_id, 
        div_relevance_milestone_id
      ) VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [
        div_relevance_story_id, 
        div_relevance_image_id, 
        div_relevance_milestone_id
      ]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Update a divRelevance
  const update = async (id, divRelevanceData) => {
    // Construire dynamiquement la requête de mise à jour
    let updateQuery = 'UPDATE div_relevance SET ';
    const values = [];
    const params = [];
    let paramIndex = 1;

    // Pour chaque champ fourni, ajouter à la requête
    for (const [key, value] of Object.entries(divRelevanceData)) {
      if (value !== undefined) {
        params.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    // Si aucun champ à mettre à jour, retourner null ou lancer une erreur
    if (params.length === 0) {
      throw new Error('No data provided for update');
    }

    // Finaliser la requête
    updateQuery += params.join(', ');
    updateQuery += ` WHERE div_relevance_id = $${paramIndex} RETURNING *`;
    values.push(id);

    try {
      const result = await db.query(updateQuery, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Delete a divRelevance
  const remove = async (id) => {
    const query = 'DELETE FROM div_relevance WHERE div_relevance_id = $1 RETURNING *';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Méthodes auxiliaires pour les relations
  
  // Get divRelevances by story_id
  const findByStoryId = async (storyId) => {
    const query = `
      SELECT * FROM div_relevance
      WHERE div_relevance_story_id = $1
      ORDER BY div_relevance_id
    `;
    try {
      const result = await db.query(query, [storyId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get divRelevances by milestone_id
  const findByMilestoneId = async (milestoneId) => {
    const query = `
      SELECT * FROM div_relevance
      WHERE div_relevance_milestone_id = $1
      ORDER BY div_relevance_id
    `;
    try {
      const result = await db.query(query, [milestoneId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get divRelevances by image_id
  const findByImageId = async (imageId) => {
    const query = `
      SELECT * FROM div_relevance
      WHERE div_relevance_image_id = $1
      ORDER BY div_relevance_id
    `;
    try {
      const result = await db.query(query, [imageId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  return {
    findAll,
    findById,
    create,
    update,
    remove,
    findByStoryId,
    findByMilestoneId,
    findByImageId
  };
};