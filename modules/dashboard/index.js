const isAuthorized = require("../../common/middelware/isAuthoraized");

const router = require("express").Router();

const { endpoints: dashboardEndPoints } = require("./helpers/constants");
const dashboardController = require("./controller");

router.get(
  "/",
  isAuthorized(dashboardEndPoints.DASHBOARD_GET_CHART),
  dashboardController.chart
);

module.exports = router;
