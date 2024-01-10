const isAuthorized = require("../../common/middelware/isAuthoraized");
const validateRequest = require("../../common/middelware/validateRequest");

const router = require("express").Router();

const { endpoints: roomEndPoints } = require("./helpers/constants");
const roomValidation = require("./joi");
const roomController = require("./controller");
const { upload } = require("../../common/middelware/uploadFile");

router.get(
  "/",
  isAuthorized(roomEndPoints.ROOM_GET_ALL_ROOMS),
  roomController.findAll
);
router.get(
  "/:_id",
  isAuthorized(roomEndPoints.ROOM_GET_ROOM_details),
  roomController.findOne
);
router.post(
  "/",
  isAuthorized(roomEndPoints.ROOM_CREATE_ROOM),
  upload.array("imgs", 5),
  validateRequest(roomValidation.createRoomSchema),
  roomController.create
);
router.put(
  "/:_id",
  isAuthorized(roomEndPoints.ROOM_UPDATE_ROOM),
  upload.array("imgs", 5),
  validateRequest(roomValidation.updateRoomSchema),
  roomController.updateOne
);
router.delete(
  "/:_id",
  isAuthorized(roomEndPoints.ROOM_DELETE_ROOM),
  roomController.deleteOne
);

module.exports = router;
