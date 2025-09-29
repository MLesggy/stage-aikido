module.exports = (db) => {
  // Récupérer tous les horaires de club
  const findAll = async () => {
    const query = `
      SELECT cs.*, c.club_name
      FROM club_schedules cs 
      JOIN clubs c ON cs.club_id = c.club_id
      ORDER BY cs.club_id, cs.club_schedule_day_of_week, cs.club_schedule_start_time
    `;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Récupérer un horaire de club par ID
  const findById = async (id) => {
    const query = `
      SELECT cs.*, c.club_name
      FROM club_schedules cs 
      JOIN clubs c ON cs.club_id = c.club_id
      WHERE cs.club_schedule_id = $1
    `;
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Récupérer tous les horaires d'un club spécifique
  const findByClubId = async (clubId) => {
    const query = `
      SELECT cs.*, c.club_name
      FROM club_schedules cs 
      JOIN clubs c ON cs.club_id = c.club_id
      WHERE cs.club_id = $1
      ORDER BY cs.club_schedule_day_of_week, cs.club_schedule_start_time
    `;
    try {
      const result = await db.query(query, [clubId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Créer un nouvel horaire de club
  const create = async (scheduleData) => {
    const { 
      club_schedule_day_of_week, 
      club_schedule_start_time, 
      club_schedule_end_time, 
      club_schedule_notes,
      club_id
    } = scheduleData;

    const query = `
      INSERT INTO club_schedules (
        club_schedule_day_of_week, club_schedule_start_time, club_schedule_end_time, 
        club_schedule_notes, club_id
      ) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *
    `;
    
    try {
      const values = [
        club_schedule_day_of_week, 
        club_schedule_start_time, 
        club_schedule_end_time, 
        club_schedule_notes,
        club_id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Mettre à jour un horaire de club
  const update = async (id, scheduleData) => {
    const { 
      club_schedule_day_of_week, 
      club_schedule_start_time, 
      club_schedule_end_time, 
      club_schedule_notes,
      club_id
    } = scheduleData;

    const query = `
      UPDATE club_schedules 
      SET club_schedule_day_of_week = $1, 
          club_schedule_start_time = $2, 
          club_schedule_end_time = $3, 
          club_schedule_notes = $4, 
          club_id = $5
      WHERE club_schedule_id = $6 
      RETURNING *
    `;
    
    try {
      const values = [
        club_schedule_day_of_week, 
        club_schedule_start_time, 
        club_schedule_end_time, 
        club_schedule_notes,
        club_id,
        id
      ];
      
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Supprimer un horaire de club
  const remove = async (id) => {
    const query = 'DELETE FROM club_schedules WHERE club_schedule_id = $1 RETURNING *';
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
    create,
    update,
    remove
  };
};