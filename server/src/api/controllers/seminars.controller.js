const imagesService = require('../../services/images.services');
const addressService = require('../../services/address.services');
const seminarsService = require('../../services/seminars.services');

// Contrôleur pour gérer les requêtes API liées aux seminars
class SeminarsController {
  // GET /api/seminars
  async getAllSeminars(req, res) {
    try {
      // Extract all includes
      const includes = req.query.include ? req.query.include.split(",") : [];
      const seminars = await seminarsService.getAllSeminars();
      if (!seminars) {
        return res.status(404).json({ message: 'Seminars not found' });
      }
      //if we have includes
      if (includes.length > 0) {
        for (let i = 0; i < seminars.length; i++) {
          if (includes.includes("address")) {
            seminars[i].seminar_address = await addressService.getAddressById(seminars[i].address_id);
          }
          if (includes.includes("images") || includes.includes("image")) {
            seminars[i].seminar_image = await imagesService.getImagesBySeminarId(seminars[i].seminar_id);
          }
        }
      }
      res.status(200).json(seminars);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/seminars/:id
  async getSeminarById(req, res) {
    try {
      // Extract all includes
      const includes = req.query.include ? req.query.include.split(",") : [];
      const id = parseInt(req.params.id);
      const seminar = await seminarsService.getSeminarById(id);
      // If we have includes
      if (includes.length > 0) {
        if (includes.includes("address")) {
          seminar.seminar_address = await addressService.getAddressById(seminar.address_id);
        }
        if (includes.includes("images") || includes.includes("image")) {
          seminar.seminar_image = await imagesService.getImagesBySeminarId(seminar.seminar_id);
        }
    }
      res.status(200).json(seminar);
    } catch (error) {
      if (error.message === 'Seminar non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/seminars
  async createSeminar(req, res) {
    try {
      const newSeminar = await seminarsService.createSeminar(req.body);
      res.status(201).json(newSeminar);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/seminars/:id
  async updateSeminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedSeminar = await seminarsService.updateSeminar(id, req.body);
      res.status(200).json(updatedSeminar);
    } catch (error) {
      if (error.message === 'Seminar non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/seminars/:id
  async deleteSeminar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await seminarsService.deleteSeminar(id);
      res.status(200).json({ message: 'Seminar supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Seminar non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new SeminarsController();