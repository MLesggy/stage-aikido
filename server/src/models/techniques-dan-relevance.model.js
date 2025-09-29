module.exports = (db) => {
  // Récupérer toutes les relations entre techniques et dan grades
  const findAll = async () => {
    const query = 'SELECT * FROM techniques_dan_relevance';
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des relations techniques-dan: ${error.message}`);
    }
  };

  // Récupérer une relation spécifique par sa clé composite
  const findById = async (id) => {
    const query = 'SELECT * FROM techniques_dan_relevance WHERE technique_id = $1 AND dan_grade_id = $2';
    try {
      const { rows } = await db.query(query, [id.technique_id, id.dan_grade_id]);
      return rows[0]; // Retourne la première ligne ou undefined si aucune n'est trouvée
    } catch (error) {
      throw new Error(`Erreur lors de la récupération de la relation technique-dan: ${error.message}`);
    }
  };

  // Créer une nouvelle relation
  const create = async (data) => {
    const query = 'INSERT INTO techniques_dan_relevance (technique_id, dan_grade_id) VALUES ($1, $2) RETURNING *';
    try {
      const { rows } = await db.query(query, [data.technique_id, data.dan_grade_id]);
      return rows[0];
    } catch (error) {
      throw new Error(`Erreur lors de la création de la relation technique-dan: ${error.message}`);
    }
  };

  // Supprimer une relation
  const remove = async (id) => {
    const query = 'DELETE FROM techniques_dan_relevance WHERE technique_id = $1 AND dan_grade_id = $2 RETURNING *';
    try {
      const { rows } = await db.query(query, [id.technique_id, id.dan_grade_id]);
      return rows[0]; // Retourne la relation supprimée ou undefined si aucune n'est trouvée
    } catch (error) {
      throw new Error(`Erreur lors de la suppression de la relation technique-dan: ${error.message}`);
    }
  };

  // Récupérer toutes les relations pour une technique spécifique
  const findByTechniqueId = async (techniqueId) => {
    const query = 'SELECT * FROM techniques_dan_relevance WHERE technique_id = $1';
    try {
      const { rows } = await db.query(query, [techniqueId]);
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des relations pour la technique ${techniqueId}: ${error.message}`);
    }
  };

  // Récupérer toutes les relations pour un grade dan spécifique
  const findByDanGradeId = async (danGradeId) => {
    const query = 'SELECT * FROM techniques_dan_relevance WHERE dan_grade_id = $1';
    try {
      const { rows } = await db.query(query, [danGradeId]);
      return rows;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des relations pour le grade dan ${danGradeId}: ${error.message}`);
    }
  };

    const replaceAllForTechnique = async (techniqueId, danGradeIds) => {
    const queryDelete = `
      DELETE FROM techniques_dan_relevance 
      WHERE technique_id = $1
      RETURNING *
    `;

    const queryInsert = `
      INSERT INTO techniques_dan_relevance (
        technique_id,
        dan_grade_id
      )
      VALUES ${danGradeIds.map((_, i) => `($1, $${i + 2})`).join(',')}
      RETURNING dan_grade_id
    `;

    try {
      // On commence par supprimer les anciennes relations
      await db.query(queryDelete, [techniqueId]);

      // Puis on insère les nouvelles si elles existent
      if (danGradeIds && danGradeIds.length > 0) {
        const result = await db.query(queryInsert, [techniqueId, ...danGradeIds]);
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
    findByTechniqueId,
    findByDanGradeId,
    replaceAllForTechnique
  };
};