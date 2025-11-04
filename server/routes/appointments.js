const express = require('express');
const router = express.Router();
// MODIFIED: Import adminAuth to protect the new route
const { auth, adminAuth } = require('../middleware/auth');
const Appointment = require('../models/Appointment');

// --- This route for creating appointments remains the same ---
// It will automatically set the status to 'Pending' thanks to our model's default value.
router.post('/', auth, async (req, res) => {
    const { counselor, date, time } = req.body;
    try {
        const newAppointment = new Appointment({
            student: req.user.id,
            counselor,
            date,
            time,
        });
        const appointment = await newAppointment.save();
        await appointment.populate('counselor', 'name specialty');
        res.json(appointment);
    } catch (err) {
        console.error("Appointment booking error:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- This route for fetching appointments remains the same ---
// @route   GET /api/appointments/my-appointments
// @desc    Get all appointments for the logged-in student
// @access  Private
router.get('/my-appointments', auth, async (req, res) => {
    try {
        const appointments = await Appointment.find({ student: req.user.id })
            .populate('counselor', 'name specialty')
            .sort({ date: -1, time: -1 });
        res.json(appointments);
    } catch (err) {
        console.error("Error fetching appointments:", err.message);
        res.status(500).send('Server Error');
    }
});


// --- ADDED: Route for admins to get all appointments ---
// @route   GET /api/appointments/all
// @desc    Get all appointments (Admin Only)
// @access  Private (Admin Only)
router.get('/all', adminAuth, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('student', 'name studentId')
            .populate('counselor', 'name specialty')
            .sort({ date: -1, time: -1 });
        res.json(appointments);
    } catch (err) {
        console.error("Error fetching all appointments:", err.message);
        res.status(500).send('Server Error');
    }
});

// --- ADDED: A new route for admins to update an appointment's status ---
// @route   PUT /api/appointments/status/:id
// @desc    Update the status of an appointment
// @access  Private (Admin Only)
router.put('/status/:id', adminAuth, async (req, res) => {
    const { status } = req.body;

    // A small validation to ensure the status is one of the allowed values
    const allowedStatuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid status value.' });
    }

    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: status },
            { new: true }
        )
        .populate('student', 'name studentId')
        .populate('counselor', 'name specialty');

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        
        res.json(appointment);
    } catch (err) {
        console.error("Status update error:", err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;