const milestonesService = require("../../services/milestones.services");

// Controller for milestones
class MilestonesController {
  // GET /api/milestones
  async getAllMilestones(req, res) {
    try {
      const milestones = await milestonesService.getAllMilestones();

      res.status(200).json(milestones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

// GET /api/milestones/:id
async getMilestoneById(req, res) {
  try {
    const id = parseInt(req.params.id);
    const milestone = await milestonesService.getMilestoneById(id);

    if (!milestone) {
      return res.status(404).json({ message: 'Milestone non trouvé' });
    } 

    
    res.status(200).json(milestone);
      } catch (error) {
    if (error.message === 'Milestone non trouvé') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
}

  // POST /api/milestones
  async createMilestone(req, res) {
    try {
      const newMilestone = await milestonesService.createMilestone(req.body);
      res.status(201).json(newMilestone);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/milestones/:id
  async updateMilestone(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedMilestone = await milestonesService.updateMilestone(
        id,
        req.body
      );
      res.status(200).json(updatedMilestone);
    } catch (error) {
      if (error.message === "Milestone non trouvée") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/milestones/:id
  async deleteMilestone(req, res) {
    try {
      const id = parseInt(req.params.id);
      await milestonesService.deleteMilestone(id);
      res.status(200).json({ message: "Milestone supprimée avec succès" });
    } catch (error) {
      if (error.message === "Milestone non trouvée") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new MilestonesController();
