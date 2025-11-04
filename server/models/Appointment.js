const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    counselor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Counselor',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    // --- ADDED: The new status field ---
    status: {
        type: String,
        // 'enum' restricts the status to only these possible values
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        // 'default' sets the initial value for every new appointment
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);