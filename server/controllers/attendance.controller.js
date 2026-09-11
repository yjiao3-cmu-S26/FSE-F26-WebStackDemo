// ============================================================
// LAYER: CONTROLLER   (uses ASYNC / AWAIT)
// ------------------------------------------------------------
// KNOWS:         HTTP. Status codes, req.body, res.json.
// DOES NOT KNOW: MongoDB. There is no mongoose import here and no
//                query syntax anywhere in the file.
//
// A controller TRANSLATES. Three steps, in order:
//    1. pull inputs out of the HTTP request
//    2. ask the model to do the real work
//    3. turn the result into an HTTP response
//
// WHY ASYNC/AWAIT:
//   Talking to MongoDB is a call over the network to another
//   process. Node does not sit and wait -- it goes and serves other
//   requests. "await" lets us write that pause so it READS top to
//   bottom while staying non-blocking.
//
//   Drop one await:
//       const list = AttendanceModel.listToday();   // no await
//   ...and you send the browser a Promise instead of data. Best
//   30-second bug demo there is.
// ============================================================

const AttendanceModel = require('../models/attendance.model');

class AttendanceController {
  // POST /api/attendance  -- a student checks in
  async checkIn(req, res) {
    try {
      // validateAttendance already ran, so these are present and
      // cleaned. The controller does not re-check them -- that is
      // exactly why the middleware exists.
      const { name, andrewId } = req.body;

      // Business rule: one check-in per person per day.
      // Asking the MODEL, because "already here today?" is a
      // question about data, not about HTTP.
      const existing = await AttendanceModel.findTodayByAndrewId(andrewId);

      if (existing) {
        // 409 Conflict: the request was valid, but it clashes with
        // state that already exists.
        return res.status(409).json({
          error: `${andrewId} is already checked in for today.`
        });
      }

      const record = await AttendanceModel.checkIn(name, andrewId);

      // 201 Created, and we return the saved record -- it carries
      // the _id and createdAt that MongoDB generated, which the
      // browser did not have.
      return res.status(201).json({
        message: `Thanks, ${record.name}! You are checked in.`,
        record: {
          name: record.name,
          andrewId: record.andrewId,
          createdAt: record.createdAt
        }
      });
    } catch (err) {
      console.error('[error] checkIn:', err.message);
      return res.status(500).json({ error: 'Could not record attendance.' });
    }
  }

  // GET /api/attendance  -- today's roster as JSON
  //
  // NOTE FOR THE SESSION: this endpoint is open. Anyone with the
  // link can read every Andrew ID. That is fine for a disposable
  // demo and NOT fine for real data -- it is the difference between
  // authentication (who are you) and authorization (what may you
  // do). Adding a JWT check here would be a one-line change, in
  // exactly the position validateAttendance occupies.
  async listToday(req, res) {
    try {
      const records = await AttendanceModel.listToday();
      return res.status(200).json(records);
    } catch (err) {
      console.error('[error] listToday:', err.message);
      return res.status(500).json({ error: 'Could not load the roster.' });
    }
  }
}

module.exports = new AttendanceController();
