const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const JournalEntry = require('../models/JournalEntry');

// Helper: today range
const getTodayRange = () => {
    const start = new Date();
    start.setUTCHours(0,0,0,0);
    const end = new Date();
    end.setUTCHours(23,59,59,999);
    return { start, end };
};

// GET today's journal
router.get('/today', auth, async (req, res) => {
    try {
        console.log("req.user:", req.user);

        const { start, end } = getTodayRange();

        const entry = await JournalEntry.findOne({
            user: req.user.id,
            date: { $gte: start, $lte: end }
        });

        res.json(entry);
    } catch (err) {
        console.error("Error fetching today's journal:", err);
        res.status(500).send('Server Error');
    }
});

// POST save/update today's journal
router.post('/', auth, async (req, res) => {
    try {
        const { content, mood } = req.body; // make sure mood is sent or optional
        const { start, end } = getTodayRange();

        const entry = await JournalEntry.findOneAndUpdate(
            { user: req.user.id, date: { $gte: start, $lte: end } },
            { content, mood },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(entry);
    } catch (err) {
        console.error("Error saving journal entry:", err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
