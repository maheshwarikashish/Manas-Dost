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
        required: false // optional to avoid 500 if not sent from frontend
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);

module.exports = JournalEntry;
