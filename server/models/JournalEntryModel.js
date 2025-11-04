const mongoose = require('mongoose');
const { Schema } = mongoose;

const JournalEntrySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mood: {
        type: String,
        required: false   // <-- make optional if you don't always send mood
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);
