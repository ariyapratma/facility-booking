const mongoose = require("mongoose");

const FacilitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    hourlyRate: { type: Number, required: true },
    imageUrl: String,
    openingHours: [
      {
        dayOfWeek: { type: String, required: true },
        open: { type: String, required: true },
        close: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facility", FacilitySchema);
