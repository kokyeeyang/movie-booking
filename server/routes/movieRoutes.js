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
  createMovie,
  selectAllMovies,
} = require("../controllers/movieController");
// const uploadDirectory = path.join(__dirname, "../uploads");
const uploadDirectory = path.join("uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/create-movie")
  .post(
    authenticateUser,
    authorizePermissions("admin"),
    upload.single("image"),
    createMovie
  );

router.route("/select-all-movies").get(selectAllMovies);

// router.post("/create-movie", authorizePermissions("admin"), createMovie);

module.exports = router;
