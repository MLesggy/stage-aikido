module.exports = (db) => {
  // Get all images in table
  const findAll = async () => {
    const query = "SELECT * FROM images";
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Getting images for given club_id
  const findByClubId = async (id) => {
    const query = "SELECT * FROM images WHERE club_id = $1";
    try {
      const result = await db.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Getting images for given seminar_id
  const findBySeminarId = async (id) => {
    const query = "SELECT * FROM images WHERE seminar_id = $1";
    try {
      const result = await db.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

    // Getting images for given id
  const findById = async (id) => {
    const query = "SELECT * FROM images WHERE image_id = $1";
    try {
      const result = await db.query(query, [id]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  };

  // Creating an image
  const create = async (imageData) => {
    const {
      image_name,
      image_size,
      image_type,
      image_description,
      image_blob,
      club_id,
      seminar_id,
    } = imageData;

    if (imageData.club_id && imageData.club_id != -1){
      //delete all images previously linked to this club_id
      removeForGivenClubId(imageData.club_id);
    } else if (imageData.seminar_id && imageData.seminar_id != -1){
      //delete all images previously linked to this seminar_id
      removeForGivenSeminarId(imageData.seminar_id)
    }

    const query = `
      INSERT INTO images (
        image_name, image_size, image_type, image_description, 
        image_blob, club_id, seminar_id
      ) 
      VALUES ($1, $2, $3, $4, decode($5, 'base64'), $6, $7) 
      RETURNING *
    `;

    try {
      const values = [
        image_name,
        image_size,
        image_type,
        image_description,
        image_blob,
        club_id || null,
        seminar_id || null,
      ];

      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  // Updating an image
  const update = async (id, imageData) => {
    const {
      image_name,
      image_size,
      image_type,
      image_description,
      image_blob,
      club_id,
      seminar_id,
    } = imageData;

    const query = `
      UPDATE images 
      SET image_name = $1, 
          image_size = $2, 
          image_type = $3, 
          image_description = $4, 
          image_blob = $5, 
          club_id = $7, 
          seminar_id = $8
      WHERE image_id = $9 
      RETURNING *
    `;

    try {
      const values = [
        image_name,
        image_size,
        image_type,
        image_description,
        image_blob,
        club_id || null,
        seminar_id || null,
        id,
      ];

      const result = await db.query(query, values);
      if (!result.rows[0]) {
        throw new Error("Image non trouvée");
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };


  // Deleting all images linked to this club_id
  const removeForGivenClubId = async (id) => {
    const query = "DELETE FROM images WHERE club_id = $1 RETURNING *";
    try {
      const result = await db.query(query, [id]);
      // Retourne les images supprimées ou un tableau vide si aucune n'a été trouvée
      return result.rows;
    } catch (error) {
      // On conserve les erreurs de base de données réelles
      throw error;
    }
  };

  // Deleting all images linked to this seminar_id
  const removeForGivenSeminarId = async (id) => {
    const query = "DELETE FROM images WHERE seminar_id = $1 RETURNING *";
    try {
      const result = await db.query(query, [id]);
      // Retourne les images supprimées ou un tableau vide si aucune n'a été trouvée
      return result.rows;
    } catch (error) {
      // On conserve les erreurs de base de données réelles
      throw error;
    }
  };
  // Deleting an image
  const remove = async (id) => {
    const query = "DELETE FROM images WHERE image_id = $1 RETURNING *";
    try {
      const result = await db.query(query, [id]);
      if (!result.rows[0]) {
        throw new Error("Image non trouvée");
      }
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  return {
    findAll,
    findById,
    findByClubId,
    findBySeminarId,
    create,
    update,
    remove,
    removeForGivenClubId,
    removeForGivenSeminarId
  };
};
