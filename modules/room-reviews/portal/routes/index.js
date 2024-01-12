const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../../common/middelware/validateRequest");
const router = require("express").Router();

const { endpoints: roomReviewEndPoints } = require("../../helpers/constants");
const roomReviewValidation = require("../joi");
const roomReviewController = require("../../controller");

router.get(
  "/:roomId",
  isAuthorized(roomReviewEndPoints.ROOM_REVIEW_GET_ALL),
  roomReviewController.findAll
);
router.post(
  "/",
  isAuthorized(roomReviewEndPoints.ROOM_REVIEW_CREATE),
  validateRequest(roomReviewValidation.createRoomReviewSchema),
  roomReviewController.createReview
);



module.exports = router;
