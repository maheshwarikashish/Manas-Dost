const mongoose = require('mongoose');

const CollegeStudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    // --- ADDED: New fields for department and year ---
    department: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('CollegeStudent', CollegeStudentSchema);