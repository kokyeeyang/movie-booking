const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Movie = require("../models/Movie");
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  createCinema,
  selectAllCinemas,
} = require("../controllers/cinemaController");

router.post("/create-cinema", createCinema, authorizePermissions("admin"));
router
  .route("/select-all-cinemas")
  .get(selectAllCinemas, authorizePermissions("admin"));

module.exports = router;
