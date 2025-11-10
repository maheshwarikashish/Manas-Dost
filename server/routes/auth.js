const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const CollegeStudent = require('../models/CollegeStudent.js');

// @route   POST /api/auth/register
// @desc    Register a new student after verifying against the college roster
// @access  Public
router.post('/register', async (req, res) => {
    const { name, studentId, password } = req.body;
    try {
        // Step 1: Verify the Student ID against the official college database
        const isOfficialStudent = await CollegeStudent.findOne({ studentId });
        if (!isOfficialStudent) {
            return res.status(400).json({ msg: 'This Student ID is not found in the college records.' });
        }

        // Step 2: Check if this student has already signed up for the app
        let user = await User.findOne({ studentId });
        if (user) {
            return res.status(400).json({ msg: 'This Student ID has already been registered.' });
        }

        // Step 3: If all checks pass, create the new user account
        user = new User({ name, studentId, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error("Registration Error:", err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Login for STUDENTS ONLY
// @access  Public
router.post('/login', async (req, res) => {
    const { studentId, password } = req.body;
    try {
        let user = await User.findOne({ studentId });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        // ENHANCED: Added a specific check to prevent admins from using the student login
        if (user.role !== 'student') {
            return res.status(403).json({ msg: 'Access Denied. Please use the admin login page.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/admin-login
// @desc    Login for ADMINS ONLY
// @access  Public
router.post('/admin-login', async (req, res) => {
    const { adminId, password } = req.body;
    try {
        let user = await User.findOne({ studentId: adminId });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied: Not an administrator.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }
        
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error("Admin Login Error:", err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET /api/auth
// @desc    Get logged-in user data from their token
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error("Get User Error:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile
// @desc    Update the logged-in user's profile (name and/or password)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (name) user.name = name;

        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ msg: 'Password must be at least 6 characters' });
            }
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        const userToReturn = user.toObject();
        delete userToReturn.password;
        res.json(userToReturn);
    } catch (err) {
        console.error("Profile update error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;