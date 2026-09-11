// ============================================================
// LAYER: ROUTER
// ------------------------------------------------------------
// KNOWS:         which URL + METHOD maps to which function.
// DOES NOT KNOW: how any of it works.
//
// A router is a table of contents. Nothing happens here.
//
// Express matches on METHOD **and** PATH. Both have to agree with
// what the browser sent, or no handler runs and Express answers
// 404 -- even though the server is healthy and the path exists.
// ============================================================

const express = require('express');
const attendanceController = require('../controllers/attendance.controller');
const validateAttendance = require('../middleware/validateAttendance');

const router = express.Router();

// Today's roster as JSON.
router.get('/', attendanceController.listToday);


// ------------------------------------------------------------
// ------------------------------------------------------------
router.get('/', validateAttendance, attendanceController.checkIn);


// Note the ORDER of the middleware on that line too: Express runs
// handlers left to right, so validateAttendance gets first look at
// the request and can end it before checkIn is ever called.
// Middleware position is not decoration -- it is control flow.

module.exports = router;
