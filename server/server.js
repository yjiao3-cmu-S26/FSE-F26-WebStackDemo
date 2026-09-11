// ============================================================
// ENTRY POINT -- where every layer is assembled.
// ------------------------------------------------------------
// Read this file top to bottom and you are reading the request
// pipeline in the order a request actually travels through it:
//
//     CLIENT        browser (client/scripts/attendance.js)
//        |            HTTP  -- the only protocol a browser has
//        v
//     MIDDLEWARE    requestLogger, express.json, validateAttendance
//        |
//        v
//     ROUTER        routers/attendance.router.js
//        |
//        v
//     CONTROLLER    controllers/attendance.controller.js   (async/await)
//        |
//        v
//     MODEL         models/attendance.model.js             (class)
//        |
//        v
//     DATABASE      MongoDB
// ============================================================

require('dotenv').config();

const express = require('express');
const path = require('path');

const connectDB = require('./db');
const requestLogger = require('./middleware/requestLogger');
const attendanceRouter = require('./routers/attendance.router');
const AttendanceModel = require('./models/attendance.model');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- FRONTEND ----------------------------------------------------
// The frontend lives in two places, and the split matters:
//
//   client/views/*.ejs   TEMPLATES. Rendered on the SERVER into
//                        finished HTML before anything is sent.
//                        View source in the browser: no template
//                        syntax survives. The server did that work.
//                        Served by express.static? NO -- see the
//                        static lines below.
//
//   client/scripts/      STATIC ASSETS. Shipped to the browser
//   client/css/          byte-for-byte and executed THERE.
//                        Untrusted: the user can read and edit all
//                        of it.
//
// Same feature, two sides of the network.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'client', 'views'));

// ---- MIDDLEWARE (every request passes through, in this order) ----
app.use(requestLogger);                                    // 1. log it
app.use(express.json());                                   // 2. parse JSON bodies
// 3. serve ONLY the browser-facing folders.
//    NOT all of client/ -- that would also serve client/views/*.ejs
//    as raw downloadable source. Templates are for the server to
//    render, never for the browser to fetch.
app.use('/scripts', express.static(path.join(__dirname, '../client/scripts')));
app.use('/css', express.static(path.join(__dirname, '../client/css')));

// ---- PAGES (server-rendered HTML) --------------------------------
// The date shown at the top of the form and the roster.
//
// Set SESSION_DATE to pin it for a demo or a screenshot; leave it
// null and the page shows whatever day the SERVER thinks it is.
//
// Note this affects the LABEL only. Which records count as "today"
// is decided by AttendanceModel.startOfToday(), from the real
// clock -- so on the actual session day the two agree, and pinning
// a different date here would make the label disagree with the data.
const SESSION_DATE = '2026-09-11';   // set to null for the live date

function formatToday() {
  const date = SESSION_DATE ? new Date(`${SESSION_DATE}T12:00:00`) : new Date();

  return date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });
}

// "Welcome to FSE!" with the one button.
app.get('/', (req, res) => {
  res.render('welcome');
});

// The form the button leads to.
app.get('/attendance', (req, res) => {
  res.render('attendance', { today: formatToday() });
});

// Today's roster, rendered on the server.
app.get('/roster', async (req, res) => {
  try {
    const records = await AttendanceModel.listToday();

    // Shape the data for the view HERE, so the template stays
    // simple. Templates should display, not calculate.
    res.render('roster', {
      today: formatToday(),
      records: records.map((record) => ({
        name: record.name,
        andrewId: record.andrewId,
        time: record.createdAt.toLocaleTimeString('en-US', {
          hour: 'numeric', minute: '2-digit'
        })
      }))
    });
  } catch (err) {
    console.error('[error] roster:', err.message);
    res.status(500).send('Could not load the roster.');
  }
});

// Error page. The client sends the browser here when a request
// fails for a ROUTING reason (no handler matched the method+path).
app.get('/error', (req, res) => {
  const status = req.query.status || '404';
  const method = req.query.method || 'GET';
  const path = req.query.path || req.originalUrl;

  const messages = {
    '404': 'The server answered, but no route matched that request.',
    '405': 'That path exists, but not for the method you used.'
  };

  res.status(200).render('error', {
    status,
    method,
    path,
    message: messages[status] || 'The request could not be completed.'
  });
});

// ---- API (JSON in, JSON out) -------------------------------------
// Everything under /api/attendance is handled by the router.
// server.js does not know or care what those routes are.
app.use('/api/attendance', attendanceRouter);

// ---- START -------------------------------------------------------
// Connect to the database BEFORE listening. A server that accepts
// requests it cannot serve is worse than one that has not started.
async function start() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      // THIS is the line that turns a script into a server. Before
      // it, the program would exit. After it, the process holds a
      // port and waits in a loop forever.
      console.log(`[server] running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('[fatal]  could not start:', err.message);
    process.exit(1);
  }
}

start();
