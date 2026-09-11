// ============================================================
// LAYER: DATABASE  (connection only)
// ------------------------------------------------------------
// KNOWS:         how to reach MongoDB.
// DOES NOT KNOW: what attendance is. What HTTP is. Who is asking.
//
// The connection string lives in .env and is read by NODE, here on
// the server. It is never sent to the browser -- browsers cannot
// speak the MongoDB protocol at all, so every database call in this
// app happens on this side of the network.
// ============================================================

const mongoose = require('mongoose');

async function connectDB() {
  // Accept either name -- Atlas's own docs and copied snippets use
  // MONGODB_URI, while this project's .env.example uses MONGO_URI.
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGO_URI (or MONGODB_URI) is not set. Copy .env.example to .env first.');
  }

  await mongoose.connect(uri);
  console.log('[db]     connected to MongoDB');
}

module.exports = connectDB;
