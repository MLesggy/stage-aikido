const addressService = require('../../services/address.services');

// Contrôleur pour gérer les requêtes API liées aux addresses
class AddressController {
  // GET /api/address
  async getAllAddress(req, res) {
    try {
      const address = await addressService.getAllAddress();
      res.status(200).json(address);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/address/:id
  async getAddressById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const technique = await addressService.getAddressById(id);
      res.status(200).json(technique);
    } catch (error) {
      if (error.message === 'Address non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/address
  async createAddress(req, res) {
    try {
      const newAddress = await addressService.createAddress(req.body);
      res.status(201).json(newAddress);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/address/:id
  async updateAddress(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedAddress = await addressService.updateAddress(id, req.body);
      res.status(200).json(updatedAddress);
    } catch (error) {
      if (error.message === 'Address non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/address/:id
  async deleteAddress(req, res) {
    try {
      const id = parseInt(req.params.id);
      await addressService.deleteAddress(id);
      res.status(200).json({ message: 'Address supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Address non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AddressController();