// ============================================================
// LAYER: MODEL   (written as a CLASS)
// ------------------------------------------------------------
// KNOWS:         how attendance records are stored and queried.
// DOES NOT KNOW: that HTTP exists. Search this file for "req",
//                "res", "status" or "json" -- none of them appear.
//
// WHY A CLASS?
//   It gathers every operation on one kind of data under one name,
//   and it creates a seam. Swap this class for a SQLite version and
//   nothing above it changes -- the controller still just calls
//   AttendanceModel.checkIn(). That swap is the point of the layer.
//
// THE TEST FOR THIS LAYER:
//   "Could I call these methods from a script with no browser?"
//   Yes -> the layering is intact.
// ============================================================

const Attendance = require('./attendance.schema');

class AttendanceModel {
  // "Today" is a RULE, so it lives down here -- not in the browser.
  // If the browser decided what today meant, a student in another
  // timezone would check in against the wrong session.
  startOfToday() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  // Has this andrew id already checked in today?
  // Returns the existing record, or null.
  async findTodayByAndrewId(andrewId) {
    return Attendance.findOne({
      andrewId: andrewId.toLowerCase(),
      createdAt: { $gte: this.startOfToday() }
    });
  }

  async checkIn(name, andrewId) {
    return Attendance.create({ name, andrewId });
  }

  // Everyone who checked in today, earliest first.
  async listToday() {
    return Attendance
      .find({ createdAt: { $gte: this.startOfToday() } })
      .sort({ createdAt: 1 });
  }

  async countToday() {
    return Attendance.countDocuments({
      createdAt: { $gte: this.startOfToday() }
    });
  }
}

// One shared instance. Layers above import this object and never
// touch attendance.schema directly -- that is what keeps Mongoose
// from leaking up into the controller.
module.exports = new AttendanceModel();
