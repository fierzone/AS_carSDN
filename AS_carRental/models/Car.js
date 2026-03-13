const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên xe, ex: Tesla Model 3
    brand: { type: String, required: true }, // Hãng xe, ex: Tesla
    type: { type: String, required: true }, // Loại xe, ex: Sedan, SUV
    carNumber: { type: String, unique: true, sparse: true }, // Optional car number
    pricePerDay: { type: Number, required: true }, // Giá thuê / ngày
    image: { type: String, required: true, default: 'default_car.jpg' }, // Hình ảnh xe
    description: { type: String, required: true }, // Mô tả xe
    status: { type: String, enum: ['Available', 'Rented', 'Maintenance'], default: 'Available' }, // Trạng thái xe
    features: { type: [String], default: [] } // Các tính năng (5 Seats, Electric...)
}, {
    timestamps: true
});

module.exports = mongoose.model('Car', carSchema);

