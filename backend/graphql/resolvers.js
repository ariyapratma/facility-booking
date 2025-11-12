const Facility = require("../models/Facility");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Helper: for calculating endTime from startTime + duration
function calculateEndTime(startTime, duration) {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + duration * 60;
  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMinutes = totalMinutes % 60;
  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
}

// Helper: for checking if a time in operating hours is available
function isWithinOperatingHours(openingHours, date, startTime, endTime) {
  const dayName = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
  });
  const dayEntry = openingHours.find((h) => h.dayOfWeek === dayName);

  if (!dayEntry) return false;

  // Convert to minutes for easier comparison
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const open = toMinutes(dayEntry.open);
  const close = toMinutes(dayEntry.close);
  return start >= open && end <= close;
}

const resolvers = {
  Query: {
    facilities: async (
      _,
      { search, location, minCapacity, maxRate, availableDate }
    ) => {
      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }
      if (location) {
        query.location = { $regex: location, $options: "i" };
      }
      if (minCapacity !== undefined) {
        query.capacity = { $gte: minCapacity };
      }
      if (maxRate !== undefined) {
        query.rate = { $lte: maxRate };
      }
      if (availableDate) {
        query.date = { $regex: availableDate, $options: "i" };
      }
      return await Facility.find(query);
    },

    // Get detail facility by id
    facility: async (_, { id }) => {
      return await Facility.findById(id);
    },

    // Get booking for facility in a date
    booking: async (_, { facilityId, date }) => {
      const query = { facility: facilityId };
      if (date) query.date = date;
      return await Booking.find(query).populate("user").populate("facility");
    },

    // Booking by user (dummy)
    myBooking: async () => {
      const dummyUserId = "673d1234567890abcdef123456";
      return await Booking.find({ user: dummyUserId }).populate("facility");
    },
  },

  // Relation: Booking -> Facility $ User
  Booking: {
    facility: async (parent) => {
      return await Facility.findById(parent.facility);
    },
    user: async (parent) => {
      return await User.findById(parent.user);
    },
    approvedBy: async (parent) => {
      return await User.findById(parent.approvedBy);
    },
  },

  Mutation: {
    // Create booking
    createBooking: async (_, { input }) => {
      const { facilityId, date, startTime, duration, purpose } = input;

      // Check if facility exists
      const facility = await Facility.findById(facilityId);
      if (!facility) {
        throw new Error("Facility does not exist");
      }

      // Sum endTime and duration
      const endTime = calculateEndTime(startTime, duration);

      //  Check whether it is outside operating hours
      if (
        !isWithinOperatingHours(facility.openingHours, date, startTime, endTime)
      ) {
        throw new Error(
          `Booking is not available on ${date}(${facility.name})`
        );
      }
    },
  },
};

module.exports = resolvers;
