const mongoose = require("mongoose");

const CinemaSchema = new mongoose.Schema({
  location: {
    type: String,
    required: [true, "Please provide a location for this cinema"],
  },
  capacity: {
    type: Number,
    required: [true, "Please provide a capacity"],
  },
  operator: {
    type: String,
    required: [true, "Please provide an operator"],
  },
});

module.exports = mongoose.model("Cinema", CinemaSchema);
