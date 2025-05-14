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
      res.status(404).json({"msg": "Cant find related halls"});
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
          movieListingIds: { $addToSet: "$_id" }, // <-- Add this line
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
          movieListingIds: 1,
          movie: 1,
          movieName: 1,
          genre: 1,
          duration: 1,
          ageRating: 1,
          image: 1,
          hallId: 1,
          seatingAvailability: 1,
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
          foreignField: "_id",
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

const selectSingleTimeSlot = async (req, res) => {
  try {
    const { date, time, movieId } = req.params;

    const listing = await MovieListing.aggregate([
      {
        $match: {
          showDate: {
            $gte: new Date(`${date}T00:00:00.000Z`),
            $lt: new Date(`${date}T23:59:59.999Z`),
          },
          showTime: time,
          // movie: movieId,
          movie: new mongoose.Types.ObjectId(movieId)
        }
      },
      {
        $lookup: {
          from: "movies",
          localField: "movie",
          foreignField: "_id",
          as: "movieDetails"
        },
      },
      {
        $unwind: {path: "$movieDetails", preserveNullAndEmptyArrays: true}
      },
      {
        $lookup: {
          from: "cinemas",
          localField: "cinema", // this comes from movieListing
          foreignField: "_id", // this comes from Cinemas
          as: "cinemaDetails"
        }
      },
      {
        $unwind: "$cinemaDetails"
      },
      {
        $project: {
          hallId: 1,
          movie: 1,
          cinema: 1, 
          showTime: 1,
          showDate: 1, 
          hallName: {
            $let: {
              vars: {
                hall: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$cinemaDetails.halls", // Access the halls array inside cinemaDetails
                        as: "hall",
                        cond: { $eq: [{ $toObjectId: "$$hall._id" }, { $toObjectId: "$hallId" }] } // Match hallId from MovieListing to hall._id
                      },
                    },
                    0, // Get the first matching hall (since it's an array)
                  ],
                },
              },
              // use $$ when accessing hall_name inside cinemaDetails filters
              in: { $ifNull: ["$$hall.hall_name", null] }, // Return hall_name or null if not found
            },
          },
          movieImage: { $ifNull: ["$movieDetails.image", null] },
          movieName: { $ifNull: ["$movieDetails.movieName", null] },
          seatingAvailability: 1
        }
      }
    ]);

    res.status(StatusCodes.OK).json(listing);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const bookSeats = async (req, res) => {
  console.log('in the booking seats backend now!');
  const {movieListingId, seatIds} = req.body;
  console.log("seat ids = ");
  // console.log(req.body);

  console.log(seatIds);
  if(!movieListingId || !seatIds || !Array.isArray(seatIds)){
    return res.status(StatusCodes.BAD_REQUEST).json({error: "Missing or invalid data"});
  }

  try {
    console.log(movieListingId);
    const movieListing = await MovieListing.findById(movieListingId);

    if(!movieListing){
      throw new CustomError.NotFoundError("Movie listing not found");
    }

    let seatsUpdated = 0;

    movieListing.seatingAvailability.forEach((bay) => {
      const layout = bay.layout; // This is a Map
      seatIds.forEach((seatId) => {
        const [bayId, rowLetter, seatNumberStr] = seatId.split('-');
        const seatNumber = parseInt(seatNumberStr);
        const isCorrectBay = bay._id.toString() === bayId; // match the movieListing bay with the bay that the customer has chosen

        if(isCorrectBay){
          const layout = bay.layout;
          const rowArray = typeof layout.get === 'function' ? layout.get(rowLetter) : layout[rowLetter]; // to cater for when the layout is a Map or an object

          if(rowArray && rowArray[seatNumber] === "available"){
            rowArray[seatNumber] = 'booked';
            seatsUpdated++;
          }
        }
      });
    });

    if(seatsUpdated == 0){
      return res.status(StatusCodes.BAD_REQUEST).json({error: "No seats were updated"});
    }

    await movieListing.save();

    res.status(StatusCodes.OK).json({
      msg: `${seatsUpdated} seats(s) booked successfully!`
    });

  } catch (error) {
    console.error(error.message);
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR({error: error.message}));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "No seats were updated"});
  }
}

module.exports = {
  createMovieListing,
  selectAllMovieListings,
  showCinemaMovieListings,
  selectMovieListing,
  bookSeats,
  selectSingleTimeSlot
};
