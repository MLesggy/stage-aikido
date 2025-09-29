const imagesService = require('../../services/images.services');

// Contrôleur pour gérer les requêtes API liées aux images
class ImagesController {
  // GET /api/images
  async getAllImages(req, res) {
    try {
      const images = await imagesService.getAllImages();
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/images/:id
  async getImageById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const image = await imagesService.getImageById(id);
      res.status(200).json(image);
    } catch (error) {
      if (error.message === 'Image non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/images
  async createImage(req, res) {
    try {
      const newImage = await imagesService.createImage(req.body);
      res.status(201).json(newImage);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/images/:id
  async updateImage(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedImage = await imagesService.updateImage(id, req.body);
      res.status(200).json(updatedImage);
    } catch (error) {
      if (error.message === 'Image non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/images/:id
  async deleteImage(req, res) {
    try {
      const id = parseInt(req.params.id);
      await imagesService.deleteImage(id);
      res.status(200).json({ message: 'Image supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Image non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ImagesController();