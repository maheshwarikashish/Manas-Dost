const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User'); // We will add the contacts to the User model

// @route   GET /api/emergency/contacts
// @desc    Get the logged-in user's emergency contacts
// @access  Private
router.get('/contacts', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('emergencyContacts');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.emergencyContacts || {});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/emergency/contacts
// @desc    Save or update the user's emergency contacts
// @access  Private
router.post('/contacts', auth, async (req, res) => {
    const { c1name, c1phone, c2name, c2phone } = req.body;
    
    const contacts = {
        c1: { name: c1name, phone: c1phone },
        c2: { name: c2name, phone: c2phone },
    };

    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { emergencyContacts: contacts } },
            { new: true, upsert: true }
        ).select('emergencyContacts');
        
        res.json(user.emergencyContacts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;