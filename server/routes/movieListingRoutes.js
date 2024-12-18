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
} = require("../controllers/movieListingController");

router.route("/create-movie-listing").post(createMovieListing);

router
  .route("/show-all-movie-listings")
  .get(authenticateUser, selectAllMovieListings);

router
  .route("/view-cinema-movie-listings/:id")
  .get(authenticateUser, showCinemaMovieListings);

router
  .route("/show-movie-listing/:id")
  .get(authenticateUser, selectMovieListing);

module.exports = router;
