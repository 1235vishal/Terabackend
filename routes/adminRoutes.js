const express = require('express');
const {
    getDashboard,
    getProfile,
    login,
    logout,
    register,
    updateProfile
} = require('../controllers/adminController.js');
const authMiddleware = require('../middleware/authMiddleware.js');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.post('/logout', authMiddleware, logout);
router.get('/dashboard', authMiddleware, getDashboard);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
