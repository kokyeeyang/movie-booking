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
} = require("../controllers/movieListingController");

router
  .route("/create-movie-listing")
  // .post(authenticateUser, authorizePermissions("admin"), createMovieListing);
  .post(createMovieListing);

router
  .route("/show-all-movie-listings")
  .get(authenticateUser, selectAllMovieListings);

// router.route("/show-all-movie-listings").get(selectAllMovieListings);
module.exports = router;
