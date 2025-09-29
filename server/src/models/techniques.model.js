module.exports = (db) => {
    // Récupérer toutes les techniques
  const findAll = async () => {
    const query = `
      SELECT 
        t.*,
        g.grade_name,
        w.work_form_name,
        a.attack_form_name,
        (
          SELECT json_agg(tdr.dan_grade_id)
          FROM techniques_dan_relevance tdr
          WHERE tdr.technique_id = t.technique_id
        ) AS dan_grade_ids
      FROM techniques t 
      JOIN grades g ON t.grade_id = g.grade_id
      JOIN work_forms w ON t.work_form_id = w.work_form_id
      JOIN attack_forms a ON t.attack_form_id = a.attack_form_id
    `;
    
    try {
      const result = await db.query(query);
      // Gérer le cas où il n'y a pas d'entrées dans techniques_dan_relevance
      result.rows.forEach(row => {
        if (row.dan_grade_ids === null) {
          row.dan_grade_ids = [];
        }
      });
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  
    // Récupérer une technique par ID
    const findById = async (id) => {
      const query = `
        SELECT t.*, g.grade_name, w.work_form_name, a.attack_form_name
        FROM techniques t 
        JOIN grades g ON t.grade_id = g.grade_id
        JOIN work_forms w ON t.work_form_id = w.work_form_id
        JOIN attack_forms a ON t.attack_form_id = a.attack_form_id
        WHERE t.technique_id = $1
      `;
      try {
        const result = await db.query(query, [id]);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    };
  
    // Créer une nouvelle technique
    const create = async (techniqueData) => {
      const { 
        technique_official, 
        technique_move, 
        technique_link, 
        grade_id, 
        work_form_id, 
        attack_form_id 
      } = techniqueData;
  
      const query = `
        INSERT INTO techniques (
          technique_official, technique_move, technique_link, 
          grade_id, work_form_id, attack_form_id
        ) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING *
      `;
      
      try {
        const values = [
          technique_official, 
          technique_move, 
          technique_link, 
          grade_id, 
          work_form_id, 
          attack_form_id
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    };
  
    // Mettre à jour une technique
    const update = async (id, techniqueData) => {
      const { 
        technique_official, 
        technique_move, 
        technique_link, 
        grade_id, 
        work_form_id, 
        attack_form_id 
      } = techniqueData;
  
      const query = `
        UPDATE techniques 
        SET technique_official = $1, 
            technique_move = $2, 
            technique_link = $3, 
            grade_id = $4, 
            work_form_id = $5, 
            attack_form_id = $6
        WHERE technique_id = $7 
        RETURNING *
      `;
      
      try {
        const values = [
          technique_official, 
          technique_move, 
          technique_link, 
          grade_id, 
          work_form_id, 
          attack_form_id,
          id
        ];
        
        const result = await db.query(query, values);
        return result.rows[0];
      } catch (error) {
        throw error;
      }
    };
  
    // Supprimer une technique
    const remove = async (id) => {
      const query = 'DELETE FROM techniques WHERE technique_id = $1 RETURNING *';
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
      create,
      update,
      remove
    };
  };