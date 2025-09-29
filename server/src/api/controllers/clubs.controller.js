const clubsService = require("../../services/clubs.services");
const clubSchedulesService = require("../../services/club-schedules.services");
const imagesService = require("../../services/images.services");
const linksService = require("../../services/links.services");
const addressService = require("../../services/address.services");

// Contrôleur pour gérer les requêtes API liées aux clubs
class ClubsController {
  // GET /api/clubs || /api/clubs?includes=schedules,images
  async getAllClubs(req, res) {
    try {
      const clubs = await clubsService.getAllClubs();
      // Extract all includes
      const includes = req.query.include ? req.query.include.split(",") : [];

      //if we have includes
      if (includes.length > 0) {
        for (let i = 0; i < clubs.length; i++) {
          if (includes.includes("schedules")) {
            clubs[i].club_schedules = await clubSchedulesService.getClubSchedulesByClubId(clubs[i].club_id);
          }
          if (includes.includes("images")) {
            clubs[i].club_images = await imagesService.getImagesByClubId(clubs[i].club_id);
          }
          if (includes.includes("links")) {
            clubs[i].club_links = await linksService.getLinksByClubId(clubs[i].club_id);
          }
          if (includes.includes("address")) {
            clubs[i].club_address = await addressService.getAddressById(clubs[i].address_id);
          }
        }
      }
      res.status(200).json(clubs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/clubs/:id || /api/clubs/:id?includes=schedules,images
  async getClubById(req, res) {
    try {
      const id = parseInt(req.params.id);
      // Extract all includes
      const includes = req.query.include ? req.query.include.split(",") : [];
      const club = await clubsService.getClubById(id);
      
      if (!club) {
        return res.status(404).json({ message: "Club not found" });
      }
      if (includes.includes("schedules")) {
        club.club_schedules = await clubSchedulesService.getClubSchedulesByClubId(club.club_id);
      }
      if (includes.includes("images")) {
        club.club_images = await imagesService.getImagesByClubId(club.club_id);
      }
      if (includes.includes("links")) {
        club.club_links = await linksService.getLinksByClubId(club.club_id);
      }
      if (includes.includes("address")) {
        club.club_address = await addressService.getAddressById(club.address_id);
      }
      res.status(200).json(club);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/clubs
  async createClub(req, res) {
    try {
      const newClub = await clubsService.createClub(req.body);
      res.status(201).json(newClub);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/clubs/:id
  async updateClub(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updatedClub = await clubsService.updateClub(id, req.body);
      res.status(200).json(updatedClub);
    } catch (error) {
      if (error.message === "Club non trouvée") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/clubs/:id
  async deleteClub(req, res) {
    try {
      const id = parseInt(req.params.id);
      await clubsService.deleteClub(id);
      res.status(200).json({ message: "Club supprimée avec succès" });
    } catch (error) {
      if (error.message === "Club non trouvée") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ClubsController();
