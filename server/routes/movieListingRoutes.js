const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Movie = require("../models/Movie");
const multer = require("multer");
const path = require("path"); // Import the path module
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createMovieListing,
  selectAllMovieListings,
  showCinemaMovieListings,
  selectMovieListing,
  selectMoviesByDateAndCinema,
  bookSeats,
  selectSingleTimeSlot
} = require("../controllers/movieListingController");

router.route("/create-movie-listing").post(createMovieListing);

router
  .route("/show-all-movie-listings")
  .get(selectAllMovieListings);

// we can use this already to get movies available for each individual cinema and date
router
  .route("/view-cinema-movie-listings/:id")
  .get(showCinemaMovieListings);

router
  .route("/show-movie-listing/:id")
  .get(authenticateUser, selectMovieListing);

router.route("/book-seats").post(bookSeats);

router.route("/select-single-time-slot/:date/:time/:movieId").get(authenticateUser, selectSingleTimeSlot);

module.exports = router;
