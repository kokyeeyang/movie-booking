const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    createBooking,
    userBookings,
    fetchBookingDetails
} = require('../controllers/bookingController');

router.route('/create-booking').post(authenticateUser, createBooking);

router.route('/my-bookings').get(authenticateUser, userBookings);
router.route('/:id').get(authenticateUser, fetchBookingDetails);

module.exports = router;