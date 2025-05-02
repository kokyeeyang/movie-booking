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
// dont need to authenticate user to allow users to share the ticket with other people
router.route('/:id').get(fetchBookingDetails);

module.exports = router;