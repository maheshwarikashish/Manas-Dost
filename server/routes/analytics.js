const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');
const Appointment = require('../models/Appointment');
const MoodEntry = require('../models/MoodEntry');

// @route   GET /api/analytics/stats
// @desc    Get key statistics for the admin dashboard
// @access  Private (Admin Only)
router.get('/stats', adminAuth, async (req, res) => {
    try {
        // Calculate Total Users (students only)
        const totalUsers = await User.countDocuments({ role: 'student' });

        // Calculate Daily Active Users (e.g., users with a mood entry in the last 24 hours)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const dailyActiveUsers = await MoodEntry.distinct('user', { createdAt: { $gte: yesterday } });

        // Calculate Sessions Booked this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const sessionsBooked = await Appointment.countDocuments({ createdAt: { $gte: oneWeekAgo } });
        
        // This is a simplified version. A real app would have more complex logic for avg usage.
        const stats = {
            totalUsers: totalUsers,
            dailyActive: dailyActiveUsers.length,
            sessionsBooked: sessionsBooked,
            avgUsage: '12m 15s' // This is still hardcoded for demonstration
        };

        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// You could add more complex routes here for filtering charts by department, year, etc.

module.exports = router;