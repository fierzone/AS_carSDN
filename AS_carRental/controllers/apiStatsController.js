const Booking = require('../models/Booking');
const Car = require('../models/Car');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        // Total stats
        const totalCars = await Car.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalBookings = await Booking.countDocuments();

        const revenueResult = await Booking.aggregate([
            { $match: { status: { $in: ['Confirmed', 'Ongoing', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        // Top Cars by booking count
        const topCars = await Booking.aggregate([
            { $group: { _id: '$car', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'cars',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'car'
                }
            },
            { $unwind: '$car' }
        ]);

        // Monthly revenue (for chart)
        const monthlyRevenue = await Booking.aggregate([
            { $match: { status: { $in: ['Confirmed', 'Ongoing', 'Completed'] } } },
            {
                $group: {
                    _id: { $month: '$startDate' },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id': 1 } }
        ]);

        const currentMonth = new Date().getMonth() + 1;
        const currentMonthRevenue = monthlyRevenue.find(m => m._id === currentMonth)?.revenue || 0;

        res.json({
            totalCars,
            totalUsers,
            totalBookings,
            totalRevenue,
            topCars,
            monthlyRevenue,
            currentMonthRevenue
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats };
