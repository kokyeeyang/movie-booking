const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const mongoose = require("../node_modules/mongoose");

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
router.get('/:cinemaId/halls', async( req,res) => {
  try {
    const {cinemaId} = req.params;

    const cinemaHalls = await Cinema.findById(cinemaId, 'halls');

    if(!cinemaHalls) {
      return res.status(404).json({error: 'Cinema not found'});
    }
    res.status(200).json(cinemaHalls.halls);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the halls' });
  }
});
router.get('/:hallId/bays', async( req,res) => {
  try {
    const {hall} = req.params;

    const cinema = await Cinema.findOne({
      'halls._id': mongoose.Types.ObjectId(hall)
    }, {
      'halls.$' : 1
    });

    if(cinema) {
      const hall = cinema.halls[0];
      res.status(200).json(hall);
    } else {
      return res.status(404).json({error: 'Hall not found with the provided id'});
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the halls' });
  }

  try {
    const cinema = await Cinema.findOne({
      'halls._id': mongoose.Types.ObjectId(hallId) // Match the hall by its _id
    }, {
      'halls.$': 1 // Only return the matched hall
    });

    if (cinema) {
      const hall = cinema.halls[0]; // The matched hall will be the first (and only) element in the `halls` array
      console.log(hall);
      return hall;
    } else {
      console.log("No hall found with the given id");
      return null;
    }
  } catch (error) {
    console.error("Error fetching hall:", error);
    throw error;
  }
});
module.exports = router;
