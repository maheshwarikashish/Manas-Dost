const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

// @route   POST /api/mood
// @desc    Log a new mood entry for the day
router.post('/', auth, async (req, res) => {
    const { mood } = req.body; // Expecting a mood value from 1-5
    const date = new Date(); // Use today's date
    
    // Set hours, minutes, seconds, and ms to 0 to ensure we only match the date part
    date.setUTCHours(0, 0, 0, 0);

    try {
        // Find and update today's entry, or create a new one if it doesn't exist
        let moodEntry = await MoodEntry.findOneAndUpdate(
            { user: req.user.id, date: date },
            { mood: mood },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json(moodEntry);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/mood/history
// @desc    Get mood history for the logged-in user
router.get('/history', auth, async (req, res) => {
    try {
        const history = await MoodEntry.find({ user: req.user.id }).sort({ date: -1 });
        res.json(history);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;