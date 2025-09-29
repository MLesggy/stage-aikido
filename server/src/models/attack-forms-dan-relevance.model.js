module.exports = (db) => {
  // Récupérer toutes les relations entre attack forms et dan grades
  const findAll = async () => {
    const query = 'SELECT * FROM attack_forms_dan_relevance';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer une relation par ID composite (attack_form_id et dan_grade_id)
  const findById = async (id) => {
    // Comme la clé primaire est composite, on attend un objet avec les deux IDs
    const { attack_form_id, dan_grade_id } = id;
    
    const query = 'SELECT * FROM attack_forms_dan_relevance WHERE attack_form_id = $1 AND dan_grade_id = $2';
    try {
      const result = await db.query(query, [attack_form_id, dan_grade_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Créer une nouvelle relation
  const create = async (relationData) => {
    const { attack_form_id, dan_grade_id } = relationData;

    const query = `
      INSERT INTO attack_forms_dan_relevance (
        attack_form_id,
        dan_grade_id
      )
      VALUES ($1, $2)
      RETURNING *
    `;

    try {
      const result = await db.query(query, [attack_form_id, dan_grade_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer une relation
  const remove = async (id) => {
    const { attack_form_id, dan_grade_id } = id;
    
    const query = 'DELETE FROM attack_forms_dan_relevance WHERE attack_form_id = $1 AND dan_grade_id = $2 RETURNING *';
    try {
      const result = await db.query(query, [attack_form_id, dan_grade_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Remplacer toutes les relations pour une forme d'attaque
  const replaceAllForAttackForm = async (attackFormId, danGradeIds) => {
    const queryDelete = `
      DELETE FROM attack_forms_dan_relevance 
      WHERE attack_form_id = $1
      RETURNING *
    `;

    const queryInsert = `
      INSERT INTO attack_forms_dan_relevance (
        attack_form_id,
        dan_grade_id
      )
      VALUES ${danGradeIds.map((_, i) => `($1, $${i + 2})`).join(',')}
      RETURNING dan_grade_id
    `;

    try {
      // On commence par supprimer les anciennes relations
      await db.query(queryDelete, [attackFormId]);

      // Puis on insère les nouvelles si elles existent
      if (danGradeIds && danGradeIds.length > 0) {
        const result = await db.query(queryInsert, [attackFormId, ...danGradeIds]);
        return result.rows;
      }

      return [];
    } catch (error) {
      throw error;
    }
  };


  return {
    findAll,
    findById,
    create,
    remove,
    replaceAllForAttackForm
  };
};