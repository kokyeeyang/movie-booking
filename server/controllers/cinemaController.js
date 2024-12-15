const Cinema = require("../models/Cinema");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createCinema = async (req, res) => {
  let { location, operator, capacity, halls } = req.body;

  const image = req.file ? req.file.path : "";
  const parsedHalls = halls ? JSON.parse(halls) : [];
  console.log("inside cinema controller");
  console.log(req.body);
  try {
    const cinema = await Cinema.create({
      location,
      operator,
      capacity,
      halls: parsedHalls,
      image,
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

module.exports = { createCinema, selectAllCinemas };
