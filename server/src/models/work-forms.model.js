module.exports = (db) => {
  // Récupérer toutes les formes de travail
  const findAll = async () => {
    const query = `
      SELECT *
      FROM work_forms
      ORDER BY work_form_name
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une forme de travail par ID
  const findById = async (id) => {
    const query = `
      SELECT *
      FROM work_forms
      WHERE work_form_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une forme de travail par nom
  const findByName = async (name) => {
    const query = `
      SELECT *
      FROM work_forms
      WHERE work_form_name ILIKE $1
    `;
    try {
      const result = await db.query(query, [name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer une nouvelle forme de travail
  const create = async (workFormData) => {
    const { work_form_name } = workFormData;

    const query = `
      INSERT INTO work_forms (
        work_form_name
      ) 
      VALUES ($1) 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [work_form_name]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour une forme de travail
  const update = async (id, workFormData) => {
    const { work_form_name } = workFormData;

    const query = `
      UPDATE work_forms 
      SET work_form_name = $1
      WHERE work_form_id = $2 
      RETURNING *
    `;
    
    try {
      const result = await db.query(query, [work_form_name, id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer une forme de travail
  const remove = async (id) => {
    const query = 'DELETE FROM work_forms WHERE work_form_id = $1 RETURNING *';
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