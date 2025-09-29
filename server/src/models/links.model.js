module.exports = (db) => {
// Get all links in table
const findAll = async () => {
  const query = 'SELECT * FROM links';
  try {
    const result = await db.query(query);
    return result.rows;
  } catch (error) {
    throw error;
  }
};
// Get link for given link_id
const findById = async (id) => {
  const query = 'SELECT * FROM links WHERE link_id = $1';
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

// Get links for given club_id
const findByClubId = async (clubId) => {
  const query = 'SELECT * FROM links WHERE club_id = $1';
  try {
    const result = await db.query(query, [clubId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

// Get links for given recommendation_id
const findByRecommendationId = async (recommendationId) => {
  const query = 'SELECT * FROM links WHERE recommendation_id = $1';
  try {
    const result = await db.query(query, [recommendationId]);
    return result.rows;
  } catch (error) {
    throw error;
  }
};

  // Create new link
  const create = async (linkData) => {
    const { 
      link_text, 
      link_url, 
      club_id, 
      recommendation_id 
    } = linkData;

    const query = `
      INSERT INTO links (
        link_text, link_url, club_id, recommendation_id
      ) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    
    try {
      const values = [
        link_text, 
        link_url, 
        club_id, 
        recommendation_id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Updating link
  const update = async (id, linkData) => {
    const { 
      link_text, 
      link_url, 
      club_id, 
      recommendation_id 
    } = linkData;

    const query = `
      UPDATE links 
      SET link_text = $1, 
          link_url = $2, 
          club_id = $3, 
          recommendation_id = $4
      WHERE link_id = $5 
      RETURNING *
    `;
    
    try {
      const values = [
        link_text, 
        link_url, 
        club_id, 
        recommendation_id,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Deleting link
  const remove = async (id) => {
    const query = 'DELETE FROM links WHERE link_id = $1 RETURNING *';
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
    findByClubId,
    findByRecommendationId,
    create,
    update,
    remove
  };
};