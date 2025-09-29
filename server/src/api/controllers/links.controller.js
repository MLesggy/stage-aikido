const linksService = require('../../services/links.services');

// Contrôleur pour gérer les requêtes API liées aux links
class LinksController {
  // GET /api/links
  async getAllLinks(req, res) {
    try {
      const links = await linksService.getAllLinks();
      res.status(200).json(links);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/links/:id
  async getLinkById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const link = await linksService.getLinkById(id);
      res.status(200).json(link);
    } catch (error) {
      if (error.message === 'Link non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/links
  async createLink(req, res) {
    try {
      const newLink = await linksService.createLink(req.body);
      res.status(201).json(newLink);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/links/:id
  async updateLink(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedLink = await linksService.updateLink(id, req.body);
      res.status(200).json(updatedLink);
    } catch (error) {
      if (error.message === 'Link non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/links/:id
  async deleteLink(req, res) {
    try {
      const id = parseInt(req.params.id);
      await linksService.deleteLink(id);
      res.status(200).json({ message: 'Link supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Link non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new LinksController();