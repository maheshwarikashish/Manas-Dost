const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Article', 'Video'],
        required: true,
    },
    category: {
        type: String,
        enum: ['Stress & Anxiety', 'Guided Meditation', 'Motivation Boost'],
        required: true,
    },
    content: {
        type: String, // Can be the full article text or a video URL
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);