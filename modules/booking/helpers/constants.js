const endpoints = Object.freeze({
  BOOKING_GET_ALL_BOOKING: "booking:getAllBooking",
  BOOKING_MY_BOOKING: "booking:getMyBooking",
  BOOKING_GET_BOOKING_details: "booking:getBookingDetails",
  BOOKING_UPDATE_BOOKING: "booking:updateBooking",
  BOOKING_DELETE_BOOKING: "booking:deleteBooking",
  BOOKING_CREATE_BOOKING: "booking:createBooking",
  BOOKING_PAY: "booking:payBooking",
});

const Booking_type = Object.freeze({
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
});

module.exports = {
  endpoints,
  Booking_type,
};
