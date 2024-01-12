const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../../common/middelware/validateRequest");
const router = require("express").Router();

const { endpoints: roomCommentEndPoints } = require("../../helpers/constants");
const favoriteRoomsValidation = require("../joi");
const roomCommentController = require("../../controller");

router.get(
  "/:roomId",
  isAuthorized(roomCommentEndPoints.ROOM_COMMENT_GET_ALL),
  roomCommentController.findAll
);
router.post(
  "/",
  isAuthorized(roomCommentEndPoints.ROOM_COMMENT_CREATE),
  validateRequest(favoriteRoomsValidation.createRoomCommentSchema),
  roomCommentController.createComment
);

router.delete(
  "/:commentId",
  isAuthorized(roomCommentEndPoints.ROOM_COMMENT_DELETE),
  roomCommentController.deleteComment
);

router.patch(
  "/:commentId",
  isAuthorized(roomCommentEndPoints.ROOM_COMMENT_UPDATE),
  validateRequest(favoriteRoomsValidation.updateRoomCommentSchema),
  roomCommentController.updateComment
);

module.exports = router;
