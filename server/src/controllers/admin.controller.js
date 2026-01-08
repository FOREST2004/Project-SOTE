import { adminService } from "../services/admin.service.js";

export const adminController = {
  async getRevenue(req, res) {
    try {
      const revenue = await adminService.getRevenue();
      res.json(revenue);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  },

  async getAllMovies(req, res) {
    try {
      const movies = await adminService.getAllMovies();
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  },

  async createMovie(req, res) {
    try {
      const movie = await adminService.createMovie(req.body);
      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: "Failed to create movie" });
    }
  },

  async updateMovie(req, res) {
    try {
      const movie = await adminService.updateMovie(req.params.id, req.body);
      res.json(movie);
    } catch (error) {
      res.status(500).json({ error: "Failed to update movie" });
    }
  },

  async deleteMovie(req, res) {
    try {
      const result = await adminService.deleteMovie(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete movie" });
    }
  },

  async getAllRooms(req, res) {
    try {
      const rooms = await adminService.getAllRooms();
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  },

  async createRoom(req, res) {
    try {
      const room = await adminService.createRoom(req.body);
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to create room" });
    }
  },

  async updateRoom(req, res) {
    try {
      const room = await adminService.updateRoom(req.params.id, req.body);
      res.json(room);
    } catch (error) {
      res.status(500).json({ error: "Failed to update room" });
    }
  },

  async getAllShowtimes(req, res) {
    try {
      const showtimes = await adminService.getAllShowtimes();
      res.json(showtimes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch showtimes" });
    }
  },

  async createShowtime(req, res) {
    try {
      const showtime = await adminService.createShowtime(req.body);
      res.json(showtime);
    } catch (error) {
      res.status(500).json({ error: "Failed to create showtime" });
    }
  },

  async deleteShowtime(req, res) {
    try {
      const result = await adminService.deleteShowtime(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete showtime" });
    }
  },
};
