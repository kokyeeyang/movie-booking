const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  movieName: { type: String, required: true },
  duration: { type: Number, required: true },
  genre: { type: String, required: true },
  ageRating: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  rating: { type: Number, required: false, default: null },
  image: { type: String, required: true }, // Save the image path as a string
});

module.exports = mongoose.model("Movie", MovieSchema);
