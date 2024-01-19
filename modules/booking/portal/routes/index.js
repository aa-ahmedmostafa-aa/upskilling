const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../../common/middelware/validateRequest");

const router = require("express").Router();

const { endpoints: bookingEndPoints } = require("../../helpers/constants");
const bookingValidation = require("../joi");
const bookingController = require("../../controller");

router.get(
  "/my",
  isAuthorized(bookingEndPoints.BOOKING_MY_BOOKING),
  bookingController.findAllMyBooking
);

router.get(
  "/my",
  isAuthorized(bookingEndPoints.BOOKING_MY_BOOKING),
  bookingController.findAllMyBooking
);

router.get(
  "/:_id",
  isAuthorized(bookingEndPoints.ROOM_GET_ROOM_details),
  bookingController.findOne
);

router.post(
  "/",
  isAuthorized(bookingEndPoints.BOOKING_CREATE_BOOKING),
  validateRequest(bookingValidation.createBookingSchema),
  bookingController.create
);

router.post(
  "/:_id/pay",
  isAuthorized(bookingEndPoints.BOOKING_PAY),
  validateRequest(bookingValidation.payBookingSchema),
  bookingController.pay
);


module.exports = router;
