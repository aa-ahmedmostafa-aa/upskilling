const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const validateRequest = require("../../../../common/middelware/validateRequest");
const router = require("express").Router();

const { endpoints: favoriteRoomsEndPoints } = require("../../helpers/constants");
const favoriteRoomsValidation = require("../joi");
const favoriteRoomsController = require("../../controller");

router.get(
  "/",
  isAuthorized(favoriteRoomsEndPoints.FAVORITE_ROOMS_GET_ALL),
  favoriteRoomsController.findAll
);
router.post(
  "/",
  isAuthorized(favoriteRoomsEndPoints.FAVORITE_ROOMS_CREATE),
  validateRequest(favoriteRoomsValidation.createFavoriteRoomsSchema),
  favoriteRoomsController.create
);

router.delete(
  "/:roomId",
  isAuthorized(favoriteRoomsEndPoints.FAVORITE_ROOMS_UPDATE),
  validateRequest(favoriteRoomsValidation.updateFavoriteRoomsSchema),
  favoriteRoomsController.removeOne
);

module.exports = router;
