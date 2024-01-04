const isAuthorized = require("../../common/middelware/isAuthoraized");
const validateRequest = require("../../common/middelware/validateRequest");

const router = require("express").Router();

const { endpoints: roomFacilitiesEndPoints } = require("./helpers/constants");
const roomFacilitiesValidation = require("./joi");
const roomFacilitiesController = require("./controller");

router.get(
  "/",
  isAuthorized(roomFacilitiesEndPoints.ROOM_FACILITIES_GET_ALL),
  roomFacilitiesController.findAll
);
router.get(
  "/:_id",
  isAuthorized(roomFacilitiesEndPoints.ROOM_FACILITIES_GET_ROOM_details),
  roomFacilitiesController.findOne
);
router.post(
  "/",
  isAuthorized(roomFacilitiesEndPoints.ROOM_FACILITIES_CREATE),
  validateRequest(roomFacilitiesValidation.createRoomFacilitySchema),
  roomFacilitiesController.create
);
router.put(
  "/:_id",
  isAuthorized(roomFacilitiesEndPoints.ROOM_FACILITIES_UPDATE),
  validateRequest(roomFacilitiesValidation.updateRoomFacilitySchema),
  roomFacilitiesController.updateOne
);
router.delete(
  "/:_id",
  isAuthorized(roomFacilitiesEndPoints.ROOM_FACILITIES_DELETE),
  roomFacilitiesController.deleteOne
);

module.exports = router;
