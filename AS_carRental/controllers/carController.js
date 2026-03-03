const Car = require('../models/carModel');

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find();
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            res.render('cars', { title: 'Available Cars', cars });
        } else {
            res.json(cars);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createCar = async (req, res) => {
    try {
        const newCar = new Car(req.body);
        const savedCar = await newCar.save();
        res.status(201).json(savedCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
