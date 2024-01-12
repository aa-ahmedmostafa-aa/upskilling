const config = require("../config/configuration");
const errorHandler = require("../middelware/errorHandler");

// Admin Route files
// const commonAdminRoutes = require("../routes/index");

const userRoutes = require("../../modules/users");
const userPortalRoutes = require("../../modules/users/portal/routes");
const roomRoutes = require("../../modules/rooms");
const roomPortalRoutes = require("../../modules/rooms/portal/routes/index");
const bookingRoutes = require("../../modules/booking");
const roomFacilitiesRoutes = require("../../modules/room-facilities");
const adsRoutes = require("../../modules/ads");
const bookingPortalRoutes = require("../../modules/booking/portal/routes");
const adsPortalRoutes = require("../../modules/ads/portal/routes");
const favoriteRoomsPortalRoutes = require("../../modules/favorite-rooms/portal/routes");
const roomCommentsPortalRoutes = require("../../modules/room-comments/portal/routes");
const roomReviewsPortalRoutes = require("../../modules/room-reviews/portal/routes");

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
  app.use(
    `${config.baseUrl_V0}/${config.authType.admin}/booking`,
    bookingRoutes
  );
  app.use(
    `${config.baseUrl_V0}/${config.authType.admin}/room-facilities`,
    roomFacilitiesRoutes
  );
  app.use(`${config.baseUrl_V0}/${config.authType.admin}/ads`, adsRoutes);

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

  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/ads`,
    adsPortalRoutes
  );

  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/favorite-rooms`,
    favoriteRoomsPortalRoutes
  );

  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/room-comments`,
    roomCommentsPortalRoutes
  );

  app.use(
    `${config.baseUrl_V0}/${config.authType.portal}/room-reviews`,
    roomReviewsPortalRoutes
  );

  // Central error handler
  app.use(errorHandler);
};
