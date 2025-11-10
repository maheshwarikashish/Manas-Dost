const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Counselor = require('../models/Counselor');

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const { counselor, date, time } = req.body;

  const appointment = new Appointment({
    student: req.user._id,
    counselor,
    date,
    time,
  });

  const createdAppointment = await appointment.save();
  res.status(201).json(createdAppointment);
});

// @desc    Get all appointments for a student
// @route   GET /api/appointments/student/:studentId
// @access  Private
const getStudentAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ student: req.params.studentId }).populate(
    'counselor',
    'name'
  );
  res.json(appointments);
});

// @desc    Get all appointments for a counselor
// @route   GET /api/appointments/counselor/:counselorId
// @access  Private/Admin
const getCounselorAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ counselor: req.params.counselorId }).populate(
    'student',
    'name'
  );
  res.json(appointments);
});

// @desc    Update an appointment
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (appointment) {
    appointment.status = status;
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } else {
    res.status(404);
    throw new Error('Appointment not found');
  }
});

// @desc    Get counselor availability
// @route   GET /api/appointments/counselor/:counselorId/availability
// @access  Private
const getCounselorAvailability = asyncHandler(async (req, res) => {
    const { date } = req.query;
    const { counselorId } = req.params;

    const searchDate = new Date(date);

    const startOfDay = new Date(searchDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const appointments = await Appointment.find({ 
        counselor: counselorId,
        date: {
            $gte: startOfDay,
            $lt: endOfDay
        }
    });

    const bookedTimes = appointments.map(appointment => appointment.time);

    const allTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];

    const availableTimes = allTimes.filter(time => !bookedTimes.includes(time));

    res.json(availableTimes);
});

module.exports = {
  createAppointment,
  getStudentAppointments,
  getCounselorAppointments,
  updateAppointment,
  getCounselorAvailability,
};
