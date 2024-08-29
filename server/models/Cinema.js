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
    default: {}
  }
});

BaySchema.pre("save", function (next){
  const bay = this;
  if(bay.isNew){
    const layout = {};
    const seatStatus = "available";

    for (let i = 0; i < bay.rows; i++){
      // A B C ...
      const rowLabel = String.fromCharCode(65 + i);
      layout[rowLabel] = Array(bay.seats_per_row).fill(seatStatus);
    }

    bay.layout = layout;
  }
  next();
})

const HallSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this hall'],
  },
  bays: {
    type: BaySchema,
    required: true
  }
});

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
  halls: {
    type: [HallSchema],
    required: [true, "Please provide at least one hall for this cinema"]
  }
});

module.exports = mongoose.model("Cinema", CinemaSchema);
