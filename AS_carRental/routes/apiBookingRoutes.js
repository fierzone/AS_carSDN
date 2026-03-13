const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getBookings, cancelBooking, updateBookingStatus } = require('../controllers/apiBookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createBooking).get(protect, admin, getBookings);
router.route('/mybookings').get(protect, getMyBookings);
router.route('/:id/cancel').put(protect, cancelBooking);
router.route('/:id/status').put(protect, admin, updateBookingStatus);


module.exports = router;
