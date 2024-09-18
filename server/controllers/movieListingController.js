const MovieListing = require("../models/MovieListing");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { create } = require("../models/Movie");
const mongoose = require("mongoose");
const Cinema = require("../models/Cinema");

const createMovieListing = async (req, res) => {
  let { movie, cinema } = req.body;

  // find the current cinema details
  const relatedCinemaDetails = await Cinema.findById(cinema);

  try {
    const movieListing = await MovieListing.create({
      movie: movie,
      cinema: cinema,
    });

    res.status(201).json(movieListing);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const selectAllMovieListings = async (req, res) => {
  try {
    const movieListings = await MovieListing.aggregate([
      {
        $lookup: {
          from: "movies", // Collection to join with
          localField: "movie", // Field in MovieListing that contains the ObjectId
          foreignField: "_id", // Field in the movies collection that matches the ObjectId
          as: "movieDetails", // Name of the new array field to add to the output documents
        },
      },
      {
        $lookup: {
          from: "cinemas", // Collection to join with
          localField: "cinema", // Field in MovieListing that contains the ObjectId
          foreignField: "_id", // Field in the cinemas collection that matches the ObjectId
          as: "cinemaDetails", // Name of the new array field to add to the output documents
        },
      },
      {
        $unwind: "$movieDetails", // Deconstruct the movieDetails array
      },
      {
        $unwind: "$cinemaDetails", // Deconstruct the cinemaDetails array
      },
      {
        $project: {
          _id: 1,
          "movieDetails._id": 1,
          "movieDetails.movieName": 1,
          "movieDetails.genre": 1,
          "movieDetails.duration": 1,
          "movieDetails.ageRating": 1,
          "movieDetails.image": 1,
          "cinemaDetails._id": 1,
          "cinemaDetails.location": 1,
          "cinemaDetails.operator": 1,
        },
      },
    ]);

    console.log(movieListings);
    res.status(StatusCodes.OK).json(movieListings);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = { createMovieListing, selectAllMovieListings };
