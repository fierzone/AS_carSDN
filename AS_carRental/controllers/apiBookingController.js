const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { carId, startDate, endDate } = req.body;

    try {
        const car = await Car.findById(carId);

        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        const statusStr = (car.status || '').toLowerCase();
        if (statusStr !== 'available') {
            return res.status(400).json({ message: 'Car is currently not available for rent' });
        }

        // Tính Toán Lịch Trình (Tránh Trùng Lặp)
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Kiểm tra trùng lịch đặt xe (Overlap validation)
        const overlappingBookings = await Booking.find({
            car: carId,
            status: { $in: ['Pending', 'Confirmed', 'Ongoing'] },
            $and: [
                { startDate: { $lt: end } },
                { endDate: { $gt: start } }
            ]
        });

        if (overlappingBookings.length > 0) {
            return res.status(400).json({ message: 'Car is already booked during this time period' });
        }

        // Calculate Days and Total Amount
        // Calculate Total Amount (Tính theo số giờ làm tròn lên số ngày, hoặc ngày tuyệt đối)
        const diffTime = Math.abs(end - start);
        const diffHours = diffTime / (1000 * 60 * 60);
        const totalDays = Math.ceil(diffHours / 24) || 1; // Minimum 1 day
        const totalAmount = totalDays * car.pricePerDay;

        const booking = new Booking({
            user: req.user._id,
            car: car._id,
            startDate,
            endDate,
            totalAmount
        });

        const createdBooking = await booking.save();

        // Update Car status to Rented
        car.status = 'Rented';
        await car.save();

        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/mybookings
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('car', 'name brand image pricePerDay');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({}).populate('user', 'id fullName email').populate('car', 'name brand');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Check if user owns the booking or is admin
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to cancel this booking' });
        }

        if (booking.status === 'Cancelled' || booking.status === 'Completed') {
            return res.status(400).json({ message: 'Booking cannot be cancelled' });
        }

        booking.status = 'Cancelled';
        await booking.save();

        // Release the car
        const car = await Car.findById(booking.car);
        if (car) {
            car.status = 'Available';
            await car.save();
        }

        res.json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (Admin: Confirm/Reject)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!['Confirmed', 'Rejected', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        booking.status = status;
        await booking.save();

        if (status === 'Cancelled' || status === 'Rejected') {
            const car = await Car.findById(booking.car);
            if (car) {
                car.status = 'Available';
                await car.save();
            }
        }

        res.json({ message: `Booking marked as ${status}`, booking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getBookings,
    cancelBooking,
    updateBookingStatus
};


