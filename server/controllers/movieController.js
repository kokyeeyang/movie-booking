const Movie = require("../models/Movie");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createMovie = async (req, res) => {
  let { movieName, duration, genre, ageRating, startDate, endDate } = req.body;

  const image = req.file ? req.file.path : "";
  try {
    const movie = await Movie.create({
      movieName,
      duration,
      genre,
      ageRating,
      startDate,
      endDate,
      image,
    });
    res.status(201).json(movie);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const selectAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { createMovie, selectAllMovies };
