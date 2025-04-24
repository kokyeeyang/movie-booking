const express = require('express');
const router = express.Router();

const {
    authenticateUser,
    authorizePermissions,
} = require('../middleware/authentication');

const {
    createBooking
} = require('../controllers/bookingController');

router.route('/create-booking').post(authenticateUser, createBooking);

module.exports = router;