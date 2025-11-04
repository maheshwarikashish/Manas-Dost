const mongoose = require('mongoose');

const CounselorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Counselor', CounselorSchema);