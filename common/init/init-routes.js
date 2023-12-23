const config = require("../config/configuration");
const errorHandler = require("../middelware/errorHandler");

// Admin Route files
// const commonAdminRoutes = require("../routes/index");

const userRoute = require("../../modules/users/routes");

/**
 * @function
 * Registers all app routes
 *
 * @param {object} app - Express app.
 */
module.exports = (app) => {
  // admin routes
  // app.use(`${config.baseUrl_V0}/${config.authType.admin}`, commonAdminRoutes);
  app.use(`${config.baseUrl_V0}/${config.authType.admin}/users`, userRoute);

  // Central error handler
  app.use(errorHandler);
};
