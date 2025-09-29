const gradesService = require('../../services/grades.services');

// Contrôleur pour gérer les requêtes API liées aux grades
class GradesController {
  // GET /api/grades
  async getAllGrades(req, res) {
    try {
      const grades = await gradesService.getAllGrades();
      res.status(200).json(grades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/grades/:id
  async getGradeById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const grade = await gradesService.getGradeById(id);
      res.status(200).json(grade);
    } catch (error) {
      if (error.message === 'Grade non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/grades
  async createGrade(req, res) {
    try {
      const newGrade = await gradesService.createGrade(req.body);
      res.status(201).json(newGrade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/grades/:id
  async updateGrade(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedGrade = await gradesService.updateGrade(id, req.body);
      res.status(200).json(updatedGrade);
    } catch (error) {
      if (error.message === 'Grade non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/grades/:id
  async deleteGrade(req, res) {
    try {
      const id = parseInt(req.params.id);
      await gradesService.deleteGrade(id);
      res.status(200).json({ message: 'Grade supprimée avec succès' });
    } catch (error) {
      if (error.message === 'Grade non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new GradesController();