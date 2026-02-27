import mongoose from "mongoose";
 
const MONGO_URL = process.env.MONGO_URL;
 
let isConnected = false;
 
async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(MONGO_URL);
    isConnected = true;
    console.log("MongoDB Connected");
  }
}
 
const staffSchema = new mongoose.Schema({
  userId: Number,
  staffMemberId: Number,
  shopId: Number,
  locationId: Number,
  clockIn: Date,
  clockOut: Date,
  duration: Number, // in seconds
  status: String,   // active or completed
});
 
const Staff =
  mongoose.models.staffs || mongoose.model("staffs", staffSchema);
 
 
// VERY IMPORTANT — this fixes CORS fully
export async function loader() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
 
 
// MAIN SAVE FUNCTION
export async function action({ request }) {
  await connectDB();

  try {
    const body = await request.json();

    const { userId, staffMemberId, shopId, locationId, action } = body;
    // AUTO CLOSE OLD SHIFTS (9 HOURS RULE)
const yesterdayActiveShift = await Staff.findOne({
  staffMemberId,
  shopId,
  status: "active",
});

if (yesterdayActiveShift) {
  const clockInDate = new Date(yesterdayActiveShift.clockIn);
  const today = new Date();

  const isDifferentDay =
    clockInDate.toDateString() !== today.toDateString();

  if (isDifferentDay) {
    const autoClockOut = new Date(clockInDate.getTime() + 9 * 60 * 60 * 1000);

    yesterdayActiveShift.clockOut = autoClockOut;
    yesterdayActiveShift.duration = 9 * 60 * 60; // 9 hours in seconds
    yesterdayActiveShift.status = "completed";

    await yesterdayActiveShift.save();

    console.log("Auto-closed old shift (9h rule)");
  }
}
    // Find active shift
    const activeShift = await Staff.findOne({
      staffMemberId,
      shopId,
      status: "active",
    });

    if (action === "clock_in") {
      if (activeShift) {
        return new Response(JSON.stringify({ message: "Already clocked in" }), { status: 400 });
      }

      const newShift = await Staff.create({
        userId,
        staffMemberId,
        shopId,
        locationId,
        clockIn: new Date(),
        status: "active",
      });

      return new Response(JSON.stringify({ success: true, shift: newShift }), { status: 200 });
    }

    if (action === "clock_out") {
      if (!activeShift) {
        return new Response(JSON.stringify({ message: "No active shift" }), { status: 400 });
      }

      const clockOutTime = new Date();
      const durationSeconds =
        Math.floor((clockOutTime - activeShift.clockIn) / 1000);

      activeShift.clockOut = clockOutTime;
      activeShift.duration = durationSeconds;
      activeShift.status = "completed";

      await activeShift.save();

      return new Response(JSON.stringify({ success: true, shift: activeShift }), { status: 200 });
    }

  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
 