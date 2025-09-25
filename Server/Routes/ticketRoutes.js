import express from "express";
import Ticket from "../models/Ticket.js";
import Show from "../models/Show.js";
import { protect } from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

// Buy ticket
router.post("/buy", protect, async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Find the show
    const show = await Show.findById(showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // Check available seats
    if (seats > show.availableSeats)
      return res.status(400).json({ message: "Not enough seats available" });

    // Calculate total price
    const totalPrice = seats * show.price;

    // Create ticket
    const ticket = await Ticket.create({
      showId,
      userId: req.user.id,
      seats,
      totalPrice
    });

    // Update show available seats
    show.availableSeats -= seats;
    await show.save();

    res.status(201).json({ message: "Ticket booked successfully", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
