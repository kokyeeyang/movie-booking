const Cinema = require("../models/Cinema");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createCinema = async (req, res) => {
  let { location, operator, capacity, halls } = req.body;

  try {
    const cinema = await Cinema.create({
      location,
      operator,
      capacity,
      halls,
    });
    res.status(201).json(cinema);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const selectAllCinemas = async (req, res) => {
  try {
    const allCinemas = await Cinema.find({});

    res.status(201).json(allCinemas);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

async function findHallById(hallId) {
  try {
    const cinema = await Cinema.findOne({
      'halls._id': mongoose.Types.ObjectId(hallId) // Match the hall by its _id
    }, {
      'halls.$': 1 // Only return the matched hall
    });

    if (cinema) {
      const hall = cinema.halls[0]; // The matched hall will be the first (and only) element in the `halls` array
      console.log(hall);
      return hall;
    } else {
      console.log("No hall found with the given id");
      return null;
    }
  } catch (error) {
    console.error("Error fetching hall:", error);
    throw error;
  }
}
module.exports = { createCinema, selectAllCinemas, findHallById};
