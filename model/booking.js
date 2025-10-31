import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String,
  ticketType: String,
  createdAt: { type: Date, default: Date.now },
});

export const Booking = mongoose.model("Booking", bookingSchema);
