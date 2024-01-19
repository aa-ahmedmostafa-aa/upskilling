const mongoose = require("mongoose");
const { Booking_type } = require("../helpers/constants");

const bookingSchema = new mongoose.Schema(
  {
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
    status: {
      type: String,
      enum: [...Object.values(Booking_type)], // Define your enum values here
      default: Booking_type.PENDING, // Optional: Set a default status
    },
    stripeChargeId: String,
  },
  {
    collection: "booking",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = bookingSchema;
