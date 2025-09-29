module.exports = (db) => {
  // Récupérer tous les grades
  const findAll = async () => {
    const query = `
      SELECT * FROM grades
      ORDER BY grade_id
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un grade par ID
  const findById = async (id) => {
    const query = `
      SELECT * FROM grades
      WHERE grade_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un grade par nom
  const findByName = async (name) => {
    const query = `
      SELECT * FROM grades
      WHERE grade_name = $1
    `;
    try {
      const result = await db.query(query, [name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer un nouveau grade
  const create = async (gradeData) => {
    const { grade_name } = gradeData;

    const query = `
      INSERT INTO grades (grade_name) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [grade_name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour un grade
  const update = async (id, gradeData) => {
    const { grade_name } = gradeData;

    const query = `
      UPDATE grades 
      SET grade_name = $1
      WHERE grade_id = $2 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [grade_name, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer un grade
  const remove = async (id) => {
    const query = 'DELETE FROM grades WHERE grade_id = $1 RETURNING *';
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