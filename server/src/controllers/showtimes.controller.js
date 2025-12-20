import { showtimesService } from '../services/showtimes.service.js';

export const showtimesController = {
  async getShowtimeById(req, res) {
    try {
      const showtime = await showtimesService.getShowtimeById(req.params.id);
      res.json(showtime);
    } catch (error) {
      if (error.message === 'Showtime not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to fetch showtime' });
    }
  },
};
