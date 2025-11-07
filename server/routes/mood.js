const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

// @route   POST /api/mood
// @desc    Log a new mood entry with a specific timestamp (multiple per day allowed)
router.post('/', auth, async (req, res) => {
    const { mood } = req.body; // Expecting a mood value from 1-5

    try {
        // 1. **CRITICAL CHANGE:** ALWAYS create a new entry with the full timestamp (Date.now is default)
        const newMoodEntry = new MoodEntry({
            user: req.user.id,
            mood: mood,
            // The 'date' field will automatically use Date.now() from the schema
        });

        await newMoodEntry.save();
        
        // Return the saved entry
        res.status(201).json(newMoodEntry);
    } catch (err) {
        console.error("Mood POST Error (Hourly):", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/mood/history
// @desc    Get mood history for the logged-in user (now returns full timestamp)
router.get('/history', auth, async (req, res) => {
    try {
        // Fetch ALL entries for the user, including the full date/time
        const history = await MoodEntry.find({ user: req.user.id })
            .select('mood date') 
            .sort({ date: -1 }); 
            
        // Return the raw entries with full ISO timestamps.
        // Frontend will handle filtering and formatting for the chart.
        res.json(history); 
    } catch (err) {
        console.error("Mood History GET Error (Hourly):", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;