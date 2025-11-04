const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the student
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    mood: {
        type: Number, // Storing mood as a number (e.g., 1-5)
        required: true,
        min: 1,
        max: 5,
    },
}, { timestamps: true });

module.exports = mongoose.model('MoodEntry', MoodEntrySchema);