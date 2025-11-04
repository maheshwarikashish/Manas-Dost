const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Counselor = require('../models/Counselor');

// @route   GET /api/counselors
// @desc    Get all counselors
// @access  Public (for students to see options)
router.get('/', async (req, res) => {
    try {
        const counselors = await Counselor.find();
        res.json(counselors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/counselors
// @desc    Add a new counselor
// @access  Private (Admin Only)
router.post('/', adminAuth, async (req, res) => {
    const { name, specialty } = req.body;
    try {
        const newCounselor = new Counselor({ name, specialty });
        const counselor = await newCounselor.save();
        res.json(counselor);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/counselors/:id
// @desc    Remove a counselor
// @access  Private (Admin Only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        await Counselor.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Counselor removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;