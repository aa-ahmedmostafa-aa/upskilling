// const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../../common/middelware/validateRequest");
const router = require("express").Router();

// const { endpoints: roomEndPoints } = require("../../helpers/constants");
const roomValidation = require("../joi");
const roomController = require("../../controller");

router.get(
  "/available",
  // isAuthorized(roomEndPoints.ROOM_GET_ALL_AVAILABLE_ROOMS),
  validateRequest(roomValidation.getAllAvailableRoomsSchema),
  roomController.findAllAvailableRooms
);
router.get(
  "/:_id",
  // isAuthorized(roomEndPoints.ROOM_GET_ROOM_details),
  validateRequest(roomValidation.getRoomDetailsSchema),
  roomController.findOne
);

module.exports = router;
