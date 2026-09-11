// ============================================================
// The SHAPE of one attendance record, as stored in MongoDB.
// ------------------------------------------------------------
// Kept separate from attendance.model.js on purpose:
//   this file           -> WHAT a record IS
//   attendance.model.js -> WHAT YOU CAN DO with records
// ============================================================

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    andrewId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true   // "XC5" and "xc5" are the same person
    }
  },
  {
    // Gives us createdAt, which is how we know WHEN someone checked in.
    timestamps: true
  }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
