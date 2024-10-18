const movieListing = require("../models/MovieListing");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { create } = require("../models/Movie");
const mongoose = require("mongoose");
const Cinema = require("../models/Cinema");

const checkoutMovieListing = async (req, res) => {
  console.log(req.params);
  const { selectedSeats } = req.body;
  console.log(selectedSeats);
};

module.exports = { checkoutMovieListing };
