const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người thuê liên kết User model
    car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }, // Xe được thuê liên kết Car model
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true }, // Tính tổng tiền dựa trên ngày
    status: { type: String, enum: ['Pending', 'Confirmed', 'Rejected', 'Ongoing', 'Completed', 'Cancelled'], default: 'Pending' }
}, {
    timestamps: true
});


module.exports = mongoose.model('Booking', bookingSchema);
