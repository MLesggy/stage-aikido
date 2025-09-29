module.exports = (db) => {
  // Récupérer toutes les stories
  const findAll = async () => {
    const query = `
      SELECT * FROM stories 
      ORDER BY story_id
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une story par ID
  const findById = async (id) => {
    const query = `
      SELECT * FROM stories
      WHERE story_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer une nouvelle story
  const create = async (storyData) => {
    const { story_text } = storyData;

    const query = `
      INSERT INTO stories (
        story_text
      ) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [story_text]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour une story
  const update = async (id, storyData) => {
    const { story_text } = storyData;

    const query = `
      UPDATE stories 
      SET story_text = $1
      WHERE story_id = $2 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [story_text, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer une story
  const remove = async (id) => {
    const query = 'DELETE FROM stories WHERE story_id = $1 RETURNING *';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer les stories utilisées dans des div_relevance
  const findStoriesUsedInDivRelevance = async () => {
    const query = `
      SELECT DISTINCT s.* 
      FROM stories s
      JOIN div_relevance dr ON s.story_id = dr.div_relevance_story_id
      ORDER BY s.story_id
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Rechercher des stories par texte
  const searchByText = async (searchText) => {
    const query = `
      SELECT * FROM stories
      WHERE story_text ILIKE $1
      ORDER BY story_id
    `;
    try {
      const result = await db.query(query, [`%${searchText}%`]);
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
    findStoriesUsedInDivRelevance,
    searchByText
  };
};
