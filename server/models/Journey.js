
const mongoose = require('mongoose');

// A schema for individual tasks within a journey
const TaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

// A schema for a user's wellness journey (predefined or custom)
const JourneySchema = new mongoose.Schema({
    // Link to the user who owns this journey
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // The original ID of the journey, e.g., 'anxiety' or 'custom-1678886400000'
    journeyId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // The list of tasks associated with the journey
    tasks: [TaskSchema],
    // Flag to distinguish between predefined and user-generated journeys
    isCustom: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a user can only have one copy of a predefined journey
JourneySchema.index({ user: 1, journeyId: 1 }, { unique: true });

module.exports = mongoose.model('Journey', JourneySchema);
