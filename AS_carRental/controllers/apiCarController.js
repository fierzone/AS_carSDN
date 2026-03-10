const Car = require('../models/Car');

// @desc    Fetch all cars (Car Listing)
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
    try {
        const cars = await Car.find({});
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single car matching ID (Car Detail)
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (car) {
            res.json(car);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a car (Admin)
// @route   POST /api/cars
// @access  Private/Admin
const createCar = async (req, res) => {
    const { name, brand, type, carNumber, pricePerDay, image, description, status, features } = req.body;

    try {
        const car = new Car({
            name,
            brand,
            type,
            carNumber,
            pricePerDay,
            image,
            description,
            status: status || 'Available',
            features: features || []
        });

        const createdCar = await car.save();
        res.status(201).json(createdCar);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Update a car (Admin)
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = async (req, res) => {
    const { name, brand, type, carNumber, pricePerDay, image, description, status, features } = req.body;

    try {
        const car = await Car.findById(req.params.id);

        if (car) {
            car.name = name || car.name;
            car.brand = brand || car.brand;
            car.type = type || car.type;
            car.carNumber = carNumber || car.carNumber;
            car.pricePerDay = pricePerDay || car.pricePerDay;
            car.image = image || car.image;
            car.description = description || car.description;
            car.status = status || car.status;
            car.features = features || car.features;

            const updatedCar = await car.save();
            res.json(updatedCar);
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Delete a car (Admin)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);

        if (car) {
            await car.deleteOne();
            res.json({ message: 'Car removed successfully' });
        } else {
            res.status(404).json({ message: 'Car not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
};
