const { StatusCodes } = require('http-status-codes');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

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

const userBookings = async (req, res) => {
    const accessToken = req.cookies.accessToken;
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);
    const userId = user.user.userId;
    try {
        const bookings = await Booking.find({userId}).populate('cinemaId');
        console.log('inside here!');
        console.log(userId);

        const formattedBookings = bookings.map(booking => {
            const bookingObj = booking.toObject();
            bookingObj.cinema = bookingObj.cinemaId;
            delete bookingObj.cinemaId;
            return bookingObj;
        })
        console.log(formattedBookings);
        res.status(StatusCodes.OK).json(formattedBookings);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message })
    }
}

const fetchBookingDetails = async (req, res) => {
    const bookingId = req.params.id;

    try{
        const booking = await Booking.findById(bookingId).populate('cinemaId');

        console.log(booking);
        const bookingObj = booking.toObject();
        bookingObj.cinema = bookingObj.cinemaId;
        delete bookingObj.cinemaId;
        const formattedBooking = bookingObj;
        // const formattedBooking = booking.map(booking => {
        //     const bookingObj = booking.toObject();
        //     bookingObject.cinema = bookingObj.cinemaId;
        //     delete bookingObj.cinemaId;
        //     return bookingObj;
        // });
        res.status(StatusCodes.OK).json(formattedBooking);
    } catch(error) {
        res.status(StatusCodes.BAD_REQUEST).json({ error: error.message});
    }
}

module.exports = { createBooking, userBookings, fetchBookingDetails };