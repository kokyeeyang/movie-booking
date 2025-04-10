const MovieListing = require("../models/MovieListing");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { create } = require("../models/Movie");
const mongoose = require("mongoose");
const Cinema = require("../models/Cinema");

const createMovieListing = async (req, res) => {
  let { movie, cinema, showTime, hall, showDate } = req.body;
  // const timingString = timing.join(',');
  // find the current cinema details
  try {
    const relatedCinemaDetails = await Cinema.findOne(
      { "halls._id": mongoose.Types.ObjectId(hall) },
      { "halls.$": 1 }
    );

    if (relatedCinemaDetails && relatedCinemaDetails.halls.length > 0) {
      const bays = relatedCinemaDetails.halls[0].bays;
      const movieListing = await MovieListing.create({
        movie: movie,
        cinema: cinema,
        showTime: showTime,
        hallId: hall,
        seatingAvailability: bays,
        showDate,
      });

      res.status(201).json(movieListing);
    } else {
      console.log("cant find related halls");
      return null;
    }
  } catch (error) {
    console.log(error.message);
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
        $unwind: "$cinemaDetails.halls", // Deconstruct the cinemaDetails array
      },
      {
        $match: {
          // $hallId comes from the column name inside movielisting table
          $expr: {
            $eq: ["$cinemaDetails.halls._id", { $toObjectId: "$hallId" }],
          }, // Match hallId in cinemaDetails.halls
        },
      },
      {
        $project: {
          _id: 1,
          showTime: 1,
          showDate: 1,
          seatingAvailability: 1,
          "movieDetails._id": 1,
          "movieDetails.movieName": 1,
          "movieDetails.genre": 1,
          "movieDetails.duration": 1,
          "movieDetails.ageRating": 1,
          "movieDetails.image": 1,
          "cinemaDetails.capacity": 1,
          "cinemaDetails._id": 1,
          "cinemaDetails.location": 1,
          "cinemaDetails.operator": 1,
          "cinemaDetails.halls.hall_name": 1,
        },
      },
    ]);
    res.status(StatusCodes.OK).json(movieListings);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const showCinemaMovieListings = async (req, res) => {
  try {
    const { id } = req.params; // Cinema ID from the URL
    const { startDate, endDate } = req.query; // Date range from query parameters

    const matchStage = {
      $match: {
        $expr: {
          $and: [
            { $eq: ["$cinemaDetails.halls._id", { $toObjectId: "$hallId" }] },
            { $eq: ["$cinemaDetails._id", { $toObjectId: id }] },
          ],
        },
        // Add date range filtering
        ...(startDate &&
          endDate && {
            showDate: {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          }),
      },
    };

    const movieListings = await MovieListing.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieDetails",
        },
      },
      {
        $lookup: {
          from: "cinemas",
          localField: "cinema",
          foreignField: "_id",
          as: "cinemaDetails",
        },
      },
      { $unwind: "$movieDetails" },
      { $unwind: "$cinemaDetails" },
      { $unwind: "$cinemaDetails.halls" },
    
      matchStage,
    
      {
        $group: {
          _id: "$movieDetails._id",
          movieName: { $first: "$movieDetails.movieName" },
          genre: { $first: "$movieDetails.genre" },
          duration: { $first: "$movieDetails.duration" },
          ageRating: { $first: "$movieDetails.ageRating" },
          image: { $first: "$movieDetails.image" },
          hallId: { $first: "$hallId" },
          cinemaDetails: { $first: "$cinemaDetails" },
          showTimes: { $addToSet: "$showTime" },
          showDates: { $addToSet: "$showDate" },
          seatingAvailability: { $first: "$seatingAvailability" }, // ✅ Include it here
        },
      },
    
      {
        $project: {
          _id: 1,
          movieName: 1,
          genre: 1,
          duration: 1,
          ageRating: 1,
          image: 1,
          hallId: 1,
          seatingAvailability: 1, // ✅ Include it here too
          "cinemaDetails._id": 1,
          "cinemaDetails.location": 1,
          "cinemaDetails.operator": 1,
          showTimes: 1,
          showDates: 1,
        },
      },
    ]);
    
    res.status(StatusCodes.OK).json(movieListings);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const selectMovieListing = async (req, res) => {
  try {
    const { id } = req.params;
    const movieListings = await MovieListing.aggregate([
      {
        $match: {
          _id: { $eq: new mongoose.Types.ObjectId(id) },
        },
      },
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
        $unwind: "$cinemaDetails.halls", // Deconstruct the cinemaDetails array
      },
      {
        $match: {
          // $hallId comes from the column name inside movielisting table
          $expr: {
            $eq: ["$cinemaDetails.halls._id", { $toObjectId: "$hallId" }],
          }, // Match hallId in cinemaDetails.halls
        },
      },
      {
        $project: {
          _id: 1,
          showTime: 1,
          seatingAvailability: 1,
          "movieDetails._id": 1,
          "movieDetails.movieName": 1,
          "movieDetails.genre": 1,
          "movieDetails.duration": 1,
          "movieDetails.ageRating": 1,
          "movieDetails.image": 1,
          "cinemaDetails.capacity": 1,
          "cinemaDetails._id": 1,
          "cinemaDetails.location": 1,
          "cinemaDetails.operator": 1,
          "cinemaDetails.halls.hall_name": 1,
        },
      },
    ]);

    res.status(StatusCodes.OK).json(movieListings);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createMovieListing,
  selectAllMovieListings,
  showCinemaMovieListings,
  selectMovieListing,
};
