module.exports = (db) => {
  // Récupère l'unique entrée
  const find = async () => {
    const query = 'SELECT * FROM home_data LIMIT 1';
    const result = await db.query(query);
    return result.rows[0] || null;
  };

  // Met à jour l'entrée unique
  const update = async (data) => {
    // D'abord essayer de mettre à jour
    const updateQuery = `
      UPDATE home_data SET
        home_data_title = $1,
        home_data_subtitle = $2,
        home_data_video_url = $3,
        image_id = $4
      RETURNING *
    `;

    try {
      const result = await db.query(updateQuery, [
        data.home_data_title,
        data.home_data_subtitle,
        data.home_data_video_url,
        data.image_id
      ]);
      
      if (result.rowCount === 0) {
        // Si aucune entrée existe, on crée
        return create(data);
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Création initiale (interne seulement)
  const create = async (data) => {
    const query = `
      INSERT INTO home_data 
        (home_data_title, home_data_subtitle, home_data_video_url, image_id) 
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await db.query(query, [
      data.home_data_title,
      data.home_data_subtitle,
      data.home_data_video_url,
      data.image_id
    ]);
    return result.rows[0];
  };

  return { find, update };
};