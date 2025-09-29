const danGradesService = require('../../services/dan-grades.services');

// Contrôleur pour gérer les requêtes API liées aux danGrades
class DanGradesController {
  // GET /api/danGrades
  async getAllDanGrades(req, res) {
    try {
      const danGrades = await danGradesService.getAllDanGrades();
      res.status(200).json(danGrades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/danGrades/:id
  async getDanGradeById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const danGrade = await danGradesService.getDanGradeById(id);
      res.status(200).json(danGrade);
    } catch (error) {
      if (error.message === 'DanGrade non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/danGrades
  async createDanGrade(req, res) {
    try {
      const newDanGrade = await danGradesService.createDanGrade(req.body);
      res.status(201).json(newDanGrade);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/danGrades/:id
  async updateDanGrade(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedDanGrade = await danGradesService.updateDanGrade(id, req.body);
      res.status(200).json(updatedDanGrade);
    } catch (error) {
      if (error.message === 'DanGrade non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/danGrades/:id
  async deleteDanGrade(req, res) {
    try {
      const id = parseInt(req.params.id);
      await danGradesService.deleteDanGrade(id);
      res.status(200).json({ message: 'DanGrade supprimée avec succès' });
    } catch (error) {
      if (error.message === 'DanGrade non trouvée') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DanGradesController();