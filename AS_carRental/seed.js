const mongoose = require('mongoose');
const Car = require('./models/carModel');

mongoose.connect('mongodb://127.0.0.1:27017/carRentalDB').then(async () => {
    console.log('Connected to MongoDB for seeding...');

    // Clear existing cars
    await Car.deleteMany({});

    const initialCars = [
        {
            carNumber: "51A-12345",
            model: "Mercedes GLS Luxury SUV",
            capacity: 7,
            status: "available",
            pricePerDay: 1500000,
            features: ["automatic", "air-conditioner", "GPS", "sunroof"],
            image: "images/luxury_suv.png"
        },
        {
            carNumber: "51B-67890",
            model: "Toyota Vios Compact Sedan",
            capacity: 5,
            status: "available",
            pricePerDay: 800000,
            features: ["manual", "bluetooth", "dashcam"],
            image: "images/compact_sedan.png"
        },
        {
            carNumber: "29C-11111",
            model: "Tesla Model 3 Electric Hatchback",
            capacity: 4,
            status: "available",
            pricePerDay: 1000000,
            features: ["automatic", "autopilot", "sunroof"],
            image: "images/electric_hatchback.png"
        },
        {
            carNumber: "65D-33333",
            model: "Lexus RX350 Premium SUV",
            capacity: 7,
            status: "available",
            pricePerDay: 1800000,
            features: ["automatic", "air-conditioner", "leather seats"],
            image: "images/luxury_suv.png"
        },
        {
            carNumber: "43E-44444",
            model: "Honda Civic Sedan",
            capacity: 5,
            status: "rented",
            pricePerDay: 850000,
            features: ["automatic", "bluetooth", "sport mode"],
            image: "images/compact_sedan.png"
        }
    ];

    await Car.insertMany(initialCars);
    console.log('Database seeded successfully!');
    process.exit();
}).catch(err => {
    console.error('Error seeding database:', err.message);
    process.exit(1);
});
