import { bookingsService } from "../services/bookings.service.js";

export const bookingsController = {
  async createBooking(req, res) {
    try {
      const { showtimeId, seats } = req.body;

      if (
        !showtimeId ||
        !seats ||
        !Array.isArray(seats) ||
        seats.length === 0
      ) {
        return res.status(400).json({ error: "Invalid booking data" });
      }

      const booking = await bookingsService.createBooking(
        req.user.id,
        showtimeId,
        seats
      );
      res.json(booking);
    } catch (error) {
      if (error.message === "Showtime not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Some seats are already booked") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Booking failed" });
    }
  },

  async getUserBookings(req, res) {
    try {
      const bookings = await bookingsService.getUserBookings(req.user.id);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  },

  async cancelBooking(req, res) {
    try {
      const result = await bookingsService.cancelBooking(
        req.params.id,
        req.user.id
      );
      res.json(result);
    } catch (error) {
      if (error.message === "Booking not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "Unauthorized") {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  },
};
