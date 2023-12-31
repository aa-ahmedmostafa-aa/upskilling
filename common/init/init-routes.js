const config = require("../config/configuration");
const errorHandler = require("../middelware/errorHandler");

// Admin Route files
// const commonAdminRoutes = require("../routes/index");

const userRoutes = require("../../modules/users");
const userPortalRoutes = require("../../modules/users/portal/routes");
const roomRoutes = require("../../modules/rooms");
const roomPortalRoutes = require("../../modules/rooms/portal/routes/index");
const bookingRoutes = require("../../modules/booking");
const bookingPortalRoutes = require("../../modules/booking/portal/routes");

/**
 * @function
 * Registers all app routes
 *
 * @param {object} app - Express app.
 */
module.exports = (app) => {
  // admin routes
  // app.use(`${config.baseUrl_V0}/${config.authType.admin}`, commonAdminRoutes);
  app.use(`${config.baseUrl_V0}/${config.authType.admin}/users`, userRoutes);
  app.use(`${config.baseUrl_V0}/${config.authType.admin}/rooms`, roomRoutes);
  app.use(`${config.baseUrl_V0}/${config.authType.admin}/booking`, bookingRoutes);

  // portal routes
  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/users`,
    userPortalRoutes
  );
  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/booking`,
    bookingPortalRoutes
  );
  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/rooms`,
    roomPortalRoutes
  );

  // Central error handler
  app.use(errorHandler);
};
