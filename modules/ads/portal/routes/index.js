// const isAuthorized = require("../../../../common/middelware/isAuthoraized");
const router = require("express").Router();

// const { endpoints: roomEndPoints } = require("../../helpers/constants");
const adsController = require("../../controller");

router.get("/", adsController.findAll);

router.get("/:_id", adsController.findOne);

module.exports = router;
