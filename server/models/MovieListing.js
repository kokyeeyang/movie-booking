const mongoose = require("mongoose");

const BaySchema = new mongoose.Schema({
  bay_name: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  seats_per_row: {
    type: Number,
    required: true,
  },
  layout: {
    type: Map,
    of: [String],
    default: {},
  },
});

const MovieListingSchema = new mongoose.Schema({
  movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
  cinema: { type: mongoose.Types.ObjectId, ref: "Cinema" },
  hallId: { type: String, required: true }, // Identify hall by id
  showTime: { type: String, required: true }, // time of the showing,
  showDate: { type: Date, required: true },
  seatingAvailability: {
    type: [BaySchema],
    required: true,
  },
});

module.exports = mongoose.model("MovieListing", MovieListingSchema);
