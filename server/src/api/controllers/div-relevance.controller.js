const divRelevanceService = require('../../services/div-relevance.services');
const storiesService = require('../../services/stories.services');
const imagesService = require('../../services/images.services');
const milestonesService = require('../../services/milestones.services');

// Contrôleur pour gérer les requêtes API liées aux divRelevance
class DivRelevanceController {
  // GET /api/divRelevance
  async getAllDivRelevance(req, res) {
    try {
      // Récupérer les divs de base
      const divs = await divRelevanceService.getAllDivRelevances();
      
      // Recuperation des includes
      const includes = req.query.include ? req.query.include.split(",") : [];

      // Si nous avons des includes
      if (includes.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          // Inclure les stories si demandé
          if (includes.includes("stories") || includes.includes("story")) {
            const storyId = divs[i].div_relevance_story_id;
            if (storyId) {
              divs[i].div_relevance_story = await storiesService.getStoryById(storyId);
            }
          }
          
          // Inclure les images si demandé
          if (includes.includes("images") || includes.includes("image")) {
            const imageId = divs[i].div_relevance_image_id;
            if (imageId) {
              divs[i].div_relevance_image = await imagesService.getImageById(imageId);
            }
          }
          
          // Inclure les milestones si demandé
          if (includes.includes("milestones") || includes.includes("milestone")) {
            const milestoneId = divs[i].div_relevance_milestone_id;
            if (milestoneId) {
              divs[i].div_relevance_milestone = await milestonesService.getMilestoneById(milestoneId);
            }
          }
        }
      }
      
      res.status(200).json(divs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/divRelevance/:id
  async getDivRelevanceById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const divRelevance = await divRelevanceService.getDivRelevanceById(id);
      
      if (!divRelevance) {
        return res.status(404).json({ message: 'divRelevance not found' });
      }
      
      // Recuperation des includes
      const includes = req.query.include ? req.query.include.split(",") : [];
      
      if (includes.length > 0) {
        // Inclure les stories si demandé
          if (includes.includes("stories") || includes.includes("story")) {
          const storyId = divRelevance.div_relevance_story_id;
          if (storyId) {
            divRelevance.div_relevance_story = await storiesService.getStoryById(storyId);
          }
        }
        
        // Inclure les images si demandé
        if (includes.includes("images") || includes.includes("image")) {
          const imageId = divRelevance.div_relevance_image_id;
          if (imageId) {
            divRelevance.div_relevance_image = await imagesService.getImageById(imageId);
          }
        }
        
        // Inclure les milestones si demandé
          if (includes.includes("milestones") || includes.includes("milestone")) {
          const milestoneId = divRelevance.div_relevance_milestone_id;
          if (milestoneId) {
            divRelevance.div_relevance_milestone = await milestonesService.getMilestoneById(milestoneId);
          }
        }
      }
      
      res.status(200).json(divRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/divRelevance
  async createDivRelevance(req, res) {
    try {
      const divRelevance = await divRelevanceService.createDivRelevance(req.body);
      res.status(201).json(divRelevance);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/divRelevance/:id
  async updateDivRelevance(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedDivRelevance = await divRelevanceService.updateDivRelevance(id, req.body);
      res.status(200).json(updatedDivRelevance);
    } catch (error) {
      if (error.message === 'divRelevance not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/divRelevance/:id
  async deleteDivRelevance(req, res) {
    try {
      const id = parseInt(req.params.id);
      await divRelevanceService.deleteDivRelevance(id);
      res.status(200).json({ message: 'divRelevance successfully deleted' });
    } catch (error) {
      if (error.message === 'divRelevance not found') {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DivRelevanceController();