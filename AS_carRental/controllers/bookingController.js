const Booking = require('../models/bookingModel');
const Car = require('../models/carModel');

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            res.render('bookings', { title: 'All Bookings', bookings });
        } else {
            res.json(bookings);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.renderBookForm = async (req, res) => {
    const errorMsg = req.query.error || null;
    const carNumber = req.query.carNumber || '';
    res.render('book', { title: 'Book a Car', carNumber, error: errorMsg });
};

exports.createBooking = async (req, res) => {
    const { customerName, carNumber, startDate, endDate } = req.body;
    const expectsHtml = req.headers.accept && req.headers.accept.includes('text/html');

    const respondError = (msg, status = 400) => {
        if (expectsHtml) {
            return res.redirect(`/bookings/new?carNumber=${encodeURIComponent(carNumber)}&error=${encodeURIComponent(msg)}`);
        }
        return res.status(status).json({ message: msg });
    };

    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start >= end) {
            return respondError("End date must be after start date.");
        }

        const car = await Car.findOne({ carNumber });
        if (!car) {
            return respondError("Car not found.", 404);
        }

        if (car.status !== 'available') {
            return respondError("Car is not available for booking.");
        }

        const overlappingBooking = await Booking.findOne({
            carNumber,
            $or: [
                { startDate: { $lt: end, $gte: start } },
                { endDate: { $gt: start, $lte: end } },
                { startDate: { $lte: start }, endDate: { $gte: end } }
            ]
        });

        if (overlappingBooking) {
            return respondError("Car is already booked for these dates.");
        }

        const durationInMs = end - start;
        const days = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
        const totalAmount = days * car.pricePerDay;

        const newBooking = new Booking({
            customerName,
            carNumber,
            startDate: start,
            endDate: end,
            totalAmount
        });

        const savedBooking = await newBooking.save();

        if (expectsHtml) {
            return res.redirect('/bookings');
        }
        res.status(201).json(savedBooking);
    } catch (error) {
        respondError(error.message);
    }
};

exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) return res.status(404).json({ message: "Booking not found." });

        const updateData = { ...req.body };
        const newStart = updateData.startDate ? new Date(updateData.startDate) : booking.startDate;
        const newEnd = updateData.endDate ? new Date(updateData.endDate) : booking.endDate;
        const newCarNumber = updateData.carNumber || booking.carNumber;

        if (newStart >= newEnd) {
            return res.status(400).json({ message: "End date must be after start date." });
        }

        const car = await Car.findOne({ carNumber: newCarNumber });
        if (!car) return res.status(404).json({ message: "Car not found." });

        // Update totalAmount if needed
        const durationInMs = newEnd - newStart;
        const days = Math.ceil(durationInMs / (1000 * 60 * 60 * 24));
        updateData.totalAmount = days * car.pricePerDay;

        // Recheck for overlaps
        const overlappingBooking = await Booking.findOne({
            _id: { $ne: booking._id },
            carNumber: newCarNumber,
            $or: [
                { startDate: { $lt: newEnd, $gte: newStart } },
                { endDate: { $gt: newStart, $lte: newEnd } },
                { startDate: { $lte: newStart }, endDate: { $gte: newEnd } }
            ]
        });

        if (overlappingBooking) {
            return res.status(400).json({ message: "Car is already booked for these dates." });
        }

        const updatedBooking = await Booking.findByIdAndUpdate(req.params.bookingId, updateData, { new: true });
        res.json(updatedBooking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.bookingId);
        if (!deletedBooking) return res.status(404).json({ message: "Booking not found." });
        res.json({ message: "Booking deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
