module.exports = (db) => {
  // Récupérer tous les grades dan
  const findAll = async () => {
    const query = `
      SELECT * FROM dan_grades
      ORDER BY dan_grade_id
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un grade dan par ID
  const findById = async (id) => {
    const query = `
      SELECT * FROM dan_grades
      WHERE dan_grade_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un grade dan par nom
  const findByName = async (name) => {
    const query = `
      SELECT * FROM dan_grades
      WHERE dan_grade_name = $1
    `;
    try {
      const result = await db.query(query, [name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer un nouveau grade dan
  const create = async (danGradeData) => {
    const { dan_grade_name } = danGradeData;

    const query = `
      INSERT INTO dan_grades (dan_grade_name) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [dan_grade_name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour un grade dan
  const update = async (id, danGradeData) => {
    const { dan_grade_name } = danGradeData;

    const query = `
      UPDATE dan_grades 
      SET dan_grade_name = $1
      WHERE dan_grade_id = $2 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [dan_grade_name, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer un grade dan
  const remove = async (id) => {
    const query = 'DELETE FROM dan_grades WHERE dan_grade_id = $1 RETURNING *';
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
    findByName,
    create,
    update,
    remove
  };
};