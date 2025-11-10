const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getStudentAppointments,
  getCounselorAppointments,
  updateAppointment,
  getCounselorAvailability,
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/auth');

router
  .route('/')
  .post(protect, createAppointment);

router
  .route('/student/:studentId')
  .get(protect, getStudentAppointments);

router
  .route('/counselor/:counselorId')
  .get(protect, getCounselorAppointments);

router
    .route('/counselor/:counselorId/availability')
    .get(protect, getCounselorAvailability)

router
  .route('/:id')
  .put(protect, updateAppointment)

module.exports = router;