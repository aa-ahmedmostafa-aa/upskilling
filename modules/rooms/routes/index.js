// const isAuthoraized = require("../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../common/middelware/validateRequest");

const router = require("express").Router();

// const multer = require("multer");
const roomValidation = require("../joi");
const roomController = require("../controller");
const { upload } = require("../../../common/middelware/uploadFile");

router.get("/", roomController.findAll);
router.get("/:_id", roomController.findOne);
router.post(
  "/",
  upload.array("imgs", 5),
  validateRequest(roomValidation.createRoomSchema),
  roomController.create
);
router.put(
  "/:_id",
  upload.array("imgs", 5),
  validateRequest(roomValidation.updateRoomSchema),
  roomController.updateOne
);
router.delete("/:_id", roomController.deleteOne);

module.exports = router;
