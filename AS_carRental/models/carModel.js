const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    carNumber: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    capacity: { type: Number, required: true },
    status: { type: String, enum: ['available', 'rented', 'maintenance'], default: 'available' },
    pricePerDay: { type: Number, required: true },
    features: { type: [String], default: [] },
    image: { type: String, default: 'default_car.png' }
});

module.exports = mongoose.model('Car', carSchema);
