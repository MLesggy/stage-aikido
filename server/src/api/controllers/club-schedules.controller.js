const clubSchedulesService = require('../../services/club-schedules.services');
const clubsService = require('../../services/clubs.services');

// Contrôleur pour gérer les requêtes API liées aux horaires des clubs
class ClubSchedulesController {
  // GET /api/clubs/:id/schedules
  async getClubSchedulesByClubId(req, res) {
    try {
      const clubId = parseInt(req.params.id);
      
      // First, checking club exist
      const club = await clubsService.getClubById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club non trouvé' });
      }
      const schedules = await clubSchedulesService.getClubSchedulesByClubId(clubId);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // GET /api/clubs/:id/schedules/:scheduleId
  async getClubScheduleById(req, res) {
    try {
      const clubId = parseInt(req.params.id);
      const scheduleId = parseInt(req.params.clubScheduleId);

      // First, checking club exist
      const club = await clubsService.getClubById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club non trouvé' });
      }
      
      const schedule = await clubSchedulesService.getClubScheduleById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: 'Horaire non trouvé' });
      }
      
      // Vérifier que l'horaire appartient bien au club demandé
      if (schedule.club_id !== clubId) {
        return res.status(404).json({ message: 'Cet horaire n\'appartient pas au club spécifié' });
      }
      
      res.status(200).json(schedule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // POST /api/clubs/:id/schedules
  async createClubSchedule(req, res) {
    try {
      const clubId = parseInt(req.params.id);
      
      // Vérifier d'abord que le club existe
      const club = await clubsService.getClubById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club non trouvé' });
      }
      
      // S'assurer que l'horaire est associé au bon club
      const scheduleData = {
        ...req.body,
        club_id: clubId
      };
      
      const newSchedule = await clubSchedulesService.createClubSchedule(scheduleData);
      res.status(201).json(newSchedule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // PUT /api/clubs/:id/schedules/:scheduleId
  async updateClubSchedule(req, res) {
    try {
      const clubId = parseInt(req.params.id);
      const scheduleId = parseInt(req.params.clubScheduleId);

      // Vérifier d'abord que le club existe
      const club = await clubsService.getClubById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club non trouvé' });
      }
      
      // Vérifier que l'horaire existe et qu'il appartient au club
      const existingSchedule = await clubSchedulesService.getClubScheduleById(scheduleId);
      if (!existingSchedule) {
        return res.status(404).json({ message: 'Horaire non trouvé' });
      }
      
      if (existingSchedule.club_id !== clubId) {
        return res.status(404).json({ message: 'Cet horaire n\'appartient pas au club spécifié' });
      }
      
      // Empêcher la modification du club_id
      const scheduleData = {
        ...req.body,
        club_id: clubId // Assurer que le club_id ne change pas
      };
      
      const updatedSchedule = await clubSchedulesService.updateClubSchedule(scheduleId, scheduleData);
      res.status(200).json(updatedSchedule);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // DELETE /api/clubs/:id/schedules/:scheduleId
  async deleteClubSchedule(req, res) {
    try {
      const clubId = parseInt(req.params.id);
      const scheduleId = parseInt(req.params.clubScheduleId);
      
      // Vérifier d'abord que le club existe
      const club = await clubsService.getClubById(clubId);
      if (!club) {
        return res.status(404).json({ message: 'Club non trouvé' });
      }
      
      // Vérifier que l'horaire existe et qu'il appartient au club
      const schedule = await clubSchedulesService.getClubScheduleById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ message: 'Horaire non trouvé' });
      }
      
      if (schedule.club_id !== clubId) {
        return res.status(404).json({ message: 'Cet horaire n\'appartient pas au club spécifié' });
      }
      
      await clubSchedulesService.deleteClubSchedule(scheduleId);
      res.status(200).json({ message: 'Horaire supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new ClubSchedulesController();