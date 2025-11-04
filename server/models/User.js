const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  emergencyContacts: {
    c1: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    c2: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
  },
  // --- ADDED: Field to store the user's currently active AI-generated plan ---
  activeGoalPlan: {
    goal: { type: String, default: '' },
    plan: { type: String, default: '' },
    createdAt: { type: Date },
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);