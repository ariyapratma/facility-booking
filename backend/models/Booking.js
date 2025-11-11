const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Facilitys",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    purpose: String,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

BookingSchema.index({ facility: 1, user: 1, startTime: 1 }, { unique: false });

module.exports = mongoose.model("Booking", BookingSchema);
