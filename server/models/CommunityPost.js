// Using the standard CommonJS `require` statement for consistency
const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Link to the User who replied
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const CommunityPostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    // MODIFIED: 'reactions' is now a simple Map to store emoji counts (e.g., {'❤️': 5, '👍': 12})
    // The separate ReactionSchema has been removed.
    reactions: {
        type: Map,
        of: Number,
        default: {},
    }, 
    replies: [ReplySchema],
}, { timestamps: true });

// Using the standard CommonJS `module.exports`
module.exports = mongoose.model('CommunityPost', CommunityPostSchema);

