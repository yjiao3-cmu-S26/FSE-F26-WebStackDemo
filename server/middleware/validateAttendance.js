// ============================================================
// LAYER: MIDDLEWARE  (type 2 -- one that can STOP the request)
// ------------------------------------------------------------
// Same mechanism as requestLogger, opposite purpose. This one may
// choose NOT to call next(), which ends the request right here.
// The controller is never reached.
//
//      next()          -> continue to the controller
//      res.status(400) -> stop.
//
// WHY HERE AND NOT ONLY IN THE BROWSER?
//   The form also checks for empty fields -- that is UX, so the
//   student gets instant feedback. THIS check is correctness.
//   Anyone can skip the form entirely:
//
//     curl -X POST http://localhost:3000/api/attendance \
//       -H 'Content-Type: application/json' -d '{}'
//
//   That request never touched the browser. This file is the only
//   thing standing between it and the database.
// ============================================================

// Andrew IDs are letters and digits, e.g. "xc5", "jsmith2".
const ANDREW_ID_PATTERN = /^[a-z][a-z0-9]{1,12}$/i;

function validateAttendance(req, res, next) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const andrewId = typeof req.body.andrewId === 'string' ? req.body.andrewId.trim() : '';

  if (!name) {
    return res.status(400).json({ error: 'Your name is required.' });
  }

  if (name.length > 80) {
    return res.status(400).json({ error: 'That name is too long.' });
  }

  if (!andrewId) {
    return res.status(400).json({ error: 'Your Andrew ID is required.' });
  }

  if (!ANDREW_ID_PATTERN.test(andrewId)) {
    return res.status(400).json({ error: 'That does not look like an Andrew ID.' });
  }

  // Hand the cleaned values downstream so the controller does not
  // repeat this work.
  req.body.name = name;
  req.body.andrewId = andrewId.toLowerCase();

  next();
}

module.exports = validateAttendance;
