const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

// @route   POST /api/mood
// @desc    Log a new mood entry with a specific timestamp (multiple per day allowed)
router.post('/', auth, async (req, res) => {
    const { mood } = req.body; // Expecting a mood value from 1-5

    if (!mood || mood < 1 || mood > 5) {
        return res.status(400).json({ msg: 'Invalid mood value' });
    }

    try {
        const newMoodEntry = new MoodEntry({
            user: req.user.id,
            mood: mood,
        });

        await newMoodEntry.save();
        
        res.status(201).json(newMoodEntry);
    } catch (err) {
        console.error("Mood POST Error:", err);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/mood/history
// @desc    Get mood history for the logged-in user
router.get('/history', auth, async (req, res) => {
    try {
        const history = await MoodEntry.find({ user: req.user.id })
            .select('mood date') 
            .sort({ date: -1 }); 
            
        res.json(history); 
    } catch (err) {
        console.error("Mood History GET Error:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;