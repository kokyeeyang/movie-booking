const mongoose = require("mongoose");

const MovieListingSchema = new mongoose.Schema({
  movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
  cinema: { type: mongoose.Types.ObjectId, ref: "Cinema" },
  bayId: { type: String, required: true }, // Identify bay by name
  showTime: { type: Date, required: true }, // Date and time of the showing
  seats: { type: Map, of: [String], default: {} }, // Seat layout for this showing
});

module.exports = mongoose.model("MovieListing", MovieListingSchema);
