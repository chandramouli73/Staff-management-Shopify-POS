import express from "express";
import mongoose from "mongoose";
import cors from "cors";
 
const app = express();
 
 
// Middleware
app.use(cors());
app.use(express.json());
 
 
// MongoDB Connection
mongoose.connect(
  "mongodb+srv://staff_user:Staff%40123@cluster0.bc2d0oh.mongodb.net/clockin_db?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Connected");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});
 
 
// Schema
const staffSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },shopId: {
    type: Number,
    required: true,
  },locationId: {
    type: Number,
    required: true,
  },
  staffMemberId: {
    type: Number,
    required: true,
  },
  staffName: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});
 
 
// Model
const Staff = mongoose.model("staffs", staffSchema);
 
 
// Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});
 
 
// Clock In / Clock Out API
app.post("/clockin", async (req, res) => {
  try {
 
    const { staffName, action } = req.body;
 
    const newEntry = new Staff({
      staffName,
      action,
    });
 
    await newEntry.save();
 
    console.log("Saved:", newEntry);
 
    res.status(200).json({
      success: true,
      message: "Saved successfully",
    });
 
  } catch (error) {
 
    console.log(error);
 
    res.status(500).json({
      success: false,
      message: "Error saving",
    });
 
  }
});
 
 
// Get logs API
app.get("/logs", async (req, res) => {
  try {
 
    const logs = await Staff.find().sort({ time: -1 });
 
    res.json(logs);
 
  } catch (error) {
 
    res.status(500).json({
      message: "Error fetching logs",
    });
 
  }
});
 