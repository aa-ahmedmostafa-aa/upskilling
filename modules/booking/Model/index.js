const mongoose = require("mongoose");
const bookingSchema = require("../Schema");

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
