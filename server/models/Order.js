const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  movieListingId: {
    type: mongoose.Types.ObjectId,
    ref: "MovieListing",
    required: true,
  },
  selectedSeats: { type: ["String"], required: true },
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ["Pending", "Paid", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, required: true },
});

module.exports = mongoose.model("Order", OrderSchema);
