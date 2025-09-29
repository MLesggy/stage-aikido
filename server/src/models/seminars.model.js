module.exports = (db) => {
  // Get all seminars in table
  const findAll = async () => {
    const query = 'SELECT * FROM seminars';
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Get seminar for given id
  const findById = async (id) => {
    const query = 'SELECT * FROM seminars WHERE seminar_id = $1';
    try {
      const result = await db.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Create a seminar
  const create = async (seminarData) => {
    const {
      seminar_title,
      seminar_start_time,
      seminar_end_time,
      seminar_description,
      seminar_price,
      seminar_professor,
      seminar_email,
      seminar_phone,
      address_id
    } = seminarData;

    const query = `
      INSERT INTO seminars (
        seminar_title,
        seminar_start_time,
        seminar_end_time,
        seminar_description,
        seminar_price,
        seminar_professor,
        seminar_email,
        seminar_phone,
        address_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    try {
      const values = [
        seminar_title,
        seminar_start_time,
        seminar_end_time,
        seminar_description || null,
        seminar_price || null,
        seminar_professor,
        seminar_email || null,
        seminar_phone || null,
        address_id
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Update a seminar
  const update = async (id, seminarData) => {
    const {
      seminar_title,
      seminar_start_time,
      seminar_end_time,
      seminar_description,
      seminar_price,
      seminar_professor,
      seminar_email,
      seminar_phone,
      address_id
    } = seminarData;

    const query = `
      UPDATE seminars
      SET seminar_title = $1,
          seminar_start_time = $2,
          seminar_end_time = $3,
          seminar_description = $4,
          seminar_price = $5,
          seminar_professor = $6,
          seminar_email = $7,
          seminar_phone = $8,
          address_id = $9
      WHERE seminar_id = $10
      RETURNING *
    `;

    try {
      const values = [
        seminar_title,
        seminar_start_time,
        seminar_end_time,
        seminar_description || null,
        seminar_price || null,
        seminar_professor,
        seminar_email || null,
        seminar_phone || null,
        address_id,
        id
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Delete a seminar
  const remove = async (id) => {
    const query = 'DELETE FROM seminars WHERE seminar_id = $1 RETURNING *';
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