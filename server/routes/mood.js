const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const MoodEntry = require('../models/MoodEntry');

// @route   POST /api/mood
// @desc    Log a new mood entry for the day (Upsert: creates new or updates existing)
router.post('/', auth, async (req, res) => {
    const { mood } = req.body; // Expecting a mood value from 1-5
    
    // --- FIX: Ensure consistent date object for upsert ---
    // Use the start of the day (UTC midnight) for consistency across timezones
    const today = new Date(); 
    today.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
    
    try {
        // Find and update today's entry (linked to the authenticated user ID)
        let moodEntry = await MoodEntry.findOneAndUpdate(
            // CRITICAL: Scope query by user AND the start-of-day date
            { user: req.user.id, date: today }, 
            { mood: mood }, // Update with the new mood value
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        res.json(moodEntry);
    } catch (err) {
        console.error("Mood POST Error:", err.message);
        res.status(500).send('Server Error');
    }
});

---

// @route   GET /api/mood/history
// @desc    Get mood history for the logged-in user
router.get('/history', auth, async (req, res) => {
    try {
        // CRITICAL: Filter by the authenticated user ID
        const history = await MoodEntry.find({ user: req.user.id })
            .select('mood date') // Only return the necessary fields for the chart
            .sort({ date: -1 }); // Sort by newest date first
            
        // OPTIONAL: Format date to string "YYYY-MM-DD" to exactly match the frontend's expectation/lookup format
        const formattedHistory = history.map(entry => ({
             mood: entry.mood,
             // The date is a Date object (UTC midnight), format it to a string for frontend consistency
             date: entry.date.toISOString().split('T')[0] 
        }));

        res.json(formattedHistory);
    } catch (err) {
        console.error("Mood History GET Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;