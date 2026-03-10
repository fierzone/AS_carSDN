const mongoose = require('mongoose');
const Car = require('./models/Car');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/carRentalDB').then(async () => {
    console.log('Connected to MongoDB for seeding...');

    // Clear existing cars
    await Car.deleteMany({});

    const initialCars = [
        {
            name: "Mercedes GLS Luxury SUV",
            brand: "Mercedes",
            type: "SUV",
            carNumber: "51A-12345",
            status: "Available",
            pricePerDay: 1500000,
            features: ["automatic", "air-conditioner", "GPS", "sunroof"],
            image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800",
            description: "A luxury SUV with premium features and spacious interior."
        },
        {
            name: "Toyota Vios Compact Sedan",
            brand: "Toyota",
            type: "Sedan",
            carNumber: "51B-67890",
            status: "Available",
            pricePerDay: 800000,
            features: ["manual", "bluetooth", "dashcam"],
            image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800",
            description: "Reliable and fuel-efficient sedan for city driving."
        },
        {
            name: "Tesla Model 3 Electric Hatchback",
            brand: "Tesla",
            type: "Hatchback",
            carNumber: "29C-11111",
            status: "Available",
            pricePerDay: 1000000,
            features: ["automatic", "autopilot", "sunroof"],
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=800",
            description: "High-performance electric car with advanced technology."
        },
        {
            name: "Lexus RX350 Premium SUV",
            brand: "Lexus",
            type: "SUV",
            carNumber: "65D-33333",
            status: "Available",
            pricePerDay: 1800000,
            features: ["automatic", "air-conditioner", "leather seats"],
            image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800",
            description: "Premium SUV offering comfort and style."
        },
        {
            name: "Honda Civic Sedan",
            brand: "Honda",
            type: "Sedan",
            carNumber: "43E-44444",
            status: "Rented",
            pricePerDay: 850000,
            features: ["automatic", "bluetooth", "sport mode"],
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
            description: "Sporty and reliable sedan for everyday use."
        }
    ];

    await Car.insertMany(initialCars);
    console.log('Database seeded successfully!');
    process.exit();
}).catch(err => {
    console.error('Error seeding database:', err.message);
    process.exit(1);
});

