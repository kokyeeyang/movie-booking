const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  movieListingId: { type: mongoose.Types.ObjectId, ref: "MovieListing", required: true },
  movieTitle: { type: String, required: true },

  cinemaId: { type: mongoose.Types.ObjectId, ref: "Cinema", required: true },
  hallName: { type: String, required: true },

  seats: { type: [String], required: true }, // Array of seat identifiers, e.g., ["A1", "A2"]
  bookingDate: { type: Date, default: Date.now },
  timeSlot: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  studentSeat: { type: Number, default:0 },
  seniorSeat: { type: Number, default:0 },

  status: { 
    type: String, 
    enum: ["confirmed", "cancelled", "pending"], 
    default: "confirmed"
  },
  paymentId: { type: String, required: true}
});

module.exports = mongoose.model("Booking", BookingSchema);
