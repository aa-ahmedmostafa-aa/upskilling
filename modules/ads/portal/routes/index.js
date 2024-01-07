const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const router = require("express").Router();

const { endpoints: roomEndPoints } = require("../../helpers/constants");
const adsController = require("../../controller");

router.get("/", isAuthorized(roomEndPoints.ADS_GET_ALL), adsController.findAll);

router.get(
  "/:_id",
  isAuthorized(roomEndPoints.ADS_GET_details),
  adsController.findOne
);

module.exports = router;
