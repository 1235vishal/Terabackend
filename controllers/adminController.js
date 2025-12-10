const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database.js');
const Admin = require('../models/Admin.js');

// Register Admin
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findByEmail(email);
        if (existingAdmin) {
            return res.status(409).json({
                success: false,
                message: 'Admin with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const result = await Admin.create(name, email, hashedPassword);

        return res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            adminId: result.insertId
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Login Admin
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find admin by email
        const admin = await Admin.findByEmail(email);
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        // Set token in httpOnly cookie (optional)
        res.cookie('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            adminId: admin.id,
            name: admin.name,
            email: admin.email
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Dashboard Data
const getDashboard = async (req, res) => {
    try {
        const adminId = req.admin.id;

        // Verify admin exists
        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Aggregate counts from various tables
        const conn = await pool.getConnection();
        try {
            const [[{ count: restaurantCount }]] = await conn.query('SELECT COUNT(*) AS count FROM restaurants');
            const [[{ count: menuCount }]] = await conn.query('SELECT COUNT(*) AS count FROM menus');
            const [[{ count: cateringCount }]] = await conn.query('SELECT COUNT(*) AS count FROM catering_requests');
            const [[{ count: updatesCount }]] = await conn.query('SELECT COUNT(*) AS count FROM updates');
            const [[{ count: contactsCount }]] = await conn.query('SELECT COUNT(*) AS count FROM contacts');

            return res.status(200).json({
                success: true,
                totalOrders: 0,
                totalUsers: 0,
                totalRestaurants: restaurantCount,
                totalMenus: menuCount,
                totalCatering: cateringCount,
                totalUpdates: updatesCount,
                totalContacts: contactsCount,
                admin: admin
            });
        } finally {
            conn.release();
        }
    } catch (error) {
        console.error('Dashboard error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Logout Admin
const logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie('adminToken');

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Get Admin Profile
const getProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;

        const admin = await Admin.findById(adminId);
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            admin: admin
        });
    } catch (error) {
        console.error('Profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

// Update Admin Profile
const updateProfile = async (req, res) => {
    try {
        const adminId = req.admin.id;
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name and email'
            });
        }

        const result = await Admin.update(adminId, name, email);

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    register,
    login,
    getDashboard,
    logout,
    getProfile,
    updateProfile,
};
