const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/apiUserController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);

module.exports = router;
