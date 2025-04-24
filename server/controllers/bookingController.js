const { StatusCodes } = require('http-status-codes');
const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
    const {
        userId,
        movieListingId,
        movieTitle,
        cinemaId,
        hallName,
        seats,
        bookingDate,
        timeSlot,
        totalPrice,
        studentSeat,
        seniorSeat,
        paymentId
    } = req.body;

    try {
        const booking = await Booking.create({
            userId,
            movieListingId,
            movieTitle,
            cinemaId,
            hallName,
            seats,
            bookingDate,
            timeSlot,
            totalPrice,
            studentSeat,
            seniorSeat,
            paymentId
        });
        res.status(StatusCodes.CREATED).json(booking);
    } catch (error){
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message})
    }
}

module.exports = { createBooking };