const config = require("../config/configuration");
const errorHandler = require("../middelware/errorHandler");

// Admin Route files
// const commonAdminRoutes = require("../routes/index");

const userRoutes = require("../../modules/users/routes");
const roomRoutes = require("../../modules/rooms/routes");

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

  // Central error handler
  app.use(errorHandler);
};
