const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  ticketId: { type: mongoose.Types.ObjectId },
  seatId: { type: String },
  orderId: { type: mongoose.Types.ObjectId, required: true },
  status: { type: String, enum: ["Booked", "Cancelled"], required: true },
});

module.exports = mongoose.model("Ticket", TicketSchema);
