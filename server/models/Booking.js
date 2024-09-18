const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  showingId: { type: mongoose.Types.ObjectId, ref: "Showing", required: true },
  seats: { type: [String], required: true }, // Array of seat identifiers, e.g., ["A1", "A2"]
  bookingDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", BookingSchema);
