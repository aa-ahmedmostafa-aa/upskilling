const isAuthorized = require("../../common/middelware/isAuthoraized");

const router = require("express").Router();

const { endpoints: bookingEndPoints } = require("./helpers/constants");
const bookingController = require("./controller");

router.get(
  "/",
  isAuthorized(bookingEndPoints.BOOKING_GET_ALL_BOOKING),
  bookingController.findAll
);
router.get(
  "/:_id",
  isAuthorized(bookingEndPoints.BOOKING_GET_BOOKING_details),
  bookingController.findOne
);

router.delete(
  "/:_id",
  isAuthorized(bookingEndPoints.BOOKING_DELETE_BOOKING),
  bookingController.deleteOne
);

module.exports = router;
