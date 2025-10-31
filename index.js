import express from "express";
import connectDB from "./config/db.js";
import { Booking } from "./model/booking.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Default route
app.get("/", (req, res) => {
  res.send("Synergia Event Booking API is running...");
});

// POST - Create a booking
app.post("/api/bookings", async (req, res) => {
  try {
    const { name, email, event, ticketType } = req.body;

    if (!name || !email || !event) {
      return res.status(400).json({ message: "Name, email, and event are required" });
    }

    const booking = new Booking({
      name,
      email,
      event,
      ticketType,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET - All bookings
app.get("/api/bookings", async (req, res) => {
  try {r
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET - Booking by ID
app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// PUT - Update booking
app.put("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// DELETE - Cancel booking
app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// SEARCH - by email
app.get("/api/bookings/search", async (req, res) => {
  try {
    const { email } = req.query;
    const results = await Booking.find({ email: { $regex: email, $options: "i" } });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// FILTER - by event
app.get("/api/bookings/filter", async (req, res) => {
  try {
    const { event } = req.query;
    const results = await Booking.find({ event: { $regex: event, $options: "i" } });
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
