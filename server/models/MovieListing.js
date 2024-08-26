const mongoose = require("mongoose");

const MovieListingSchema = new mongoose.Schema({
  movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
  cinema: { type: mongoose.Types.ObjectId, ref: "Cinema" },
});

module.exports = mongoose.model("MovieListing", MovieListingSchema);
