const isAuthorized = require("../../common/middelware/isAuthoraized");
const validateRequest = require("../../common/middelware/validateRequest");

const router = require("express").Router();

const { endpoints: adsEndPoints } = require("./helpers/constants");
const adsValidation = require("./joi");
const adsController = require("./controller");

router.get("/", isAuthorized(adsEndPoints.ADS_GET_ALL), adsController.findAll);
router.get(
  "/:_id",
  isAuthorized(adsEndPoints.ADS_GET_details),
  adsController.findOne
);
router.post(
  "/",
  isAuthorized(adsEndPoints.ADS_CREATE),
  validateRequest(adsValidation.createAdsSchema),
  adsController.create
);
router.put(
  "/:_id",
  isAuthorized(adsEndPoints.ADS_UPDATE),
  validateRequest(adsValidation.updateAdsSchema),
  adsController.updateOne
);
router.delete(
  "/:_id",
  isAuthorized(adsEndPoints.ADS_DELETE),
  adsController.deleteOne
);

module.exports = router;
