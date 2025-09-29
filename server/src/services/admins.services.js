const { adminsModel } = require('../models');

// Service for admins
class AdminsService {
  // Get all admins in table
  async getAllAdmins() {
    try {
      return await adminsModel.findAll();
    } catch (error) {
      throw new Error(`Error while getting admins: ${error.message}`);
    }
  }

  // Get admin for given id
  async getAdminById(id) {
    try {
      const admin = await adminsModel.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      return admin;
    } catch (error) {
      throw new Error(`Error while getting admin: ${error.message}`);
    }
  }

  // Create a new admin
  async createAdmin(adminData) {
    try {
      // Vous pourriez ajouter des validations ici
      return await adminsModel.create(adminData);
    } catch (error) {
      throw new Error(`Error while creating admin: ${error.message}`);
    }
  }

  // Updating admin
  async updateAdmin(id, adminData) {
    try {
      const admin = await adminsModel.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      return await adminsModel.update(id, adminData);
    } catch (error) {
      throw new Error(`Error while updating admin: ${error.message}`);
    }
  }

  // Updating admin password with given email
  async updateAdminPassword(email, newPassword) {
    try {
      // If the admin exist
      const admin = await adminsModel.findAdminByEmail(email);
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      // Hash
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Updating
      return await adminsModel.updatePassword(email, hashedPassword);
    } catch (error) {
      throw new Error(`Error while updating admin password: ${error.message}`);
    }
  }

  // Deleting an admin
  async deleteAdmin(id) {
    try {
      const admin = await adminsModel.findById(id);
      if (!admin) {
        throw new Error('Admin not found');
      }
      
      return await adminsModel.remove(id);
    } catch (error) {
      throw new Error(`Error while deleting admin: ${error.message}`);
    }
  }
}

module.exports = new AdminsService();