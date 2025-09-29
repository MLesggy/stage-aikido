const { addressModel } = require('../models');

// Service for address
class AddressService {
  // Getting all address in table
  async getAllAddress() {
    try {
      return await addressModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting all address: ${error.message}`);
    }
  }

  // Getting address for given id
  async getAddressById(id) {
    try {
      const address = await addressModel.findById(id);
      if (!address) {
        throw new Error('Address not found');
      }
      return address;
    } catch (error) {
      throw new Error(`Error while getting address: ${error.message}`);
    }
  }

  // Creating an address
  async createAddress(addressData) {
    try {
      // may add verification here.
      return await addressModel.create(addressData);
    } catch (error) {
      throw new Error(`Error while creating address: ${error.message}`);
    }
  }

  // Updating an address
  async updateAddress(id, addressData) {
    try {
      const address = await addressModel.findById(id);
      if (!address) {
        throw new Error('Address not found');
      }
      
      return await addressModel.update(id, addressData);
    } catch (error) {
      throw new Error(`Error while updating address: ${error.message}`);
    }
  }

  // Deleting an address
  async deleteAddress(id) {
    try {
      const address = await addressModel.findById(id);
      if (!address) {
        throw new Error('Address not found');
      }
      
      return await addressModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting address: ${error.message}`);
    }
  }
}

module.exports = new AddressService();