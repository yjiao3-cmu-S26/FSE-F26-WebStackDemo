// ============================================================
// LAYER: MIDDLEWARE  (type 1 -- runs on EVERY request)
// ------------------------------------------------------------
// The simplest possible demonstration of what middleware is:
// a function in the path of a request that does something and
// then says "carry on" by calling next().
//
// Watch the terminal while clicking in the browser. Every click
// prints a line here BEFORE any controller runs.
//
// Comment out next() and the browser hangs forever -- middleware
// is not a hook that fires alongside your handler, it is IN THE PATH.
// ============================================================

function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - startedAt;
    console.log(`[http]   ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });

  next();
}

module.exports = requestLogger;
