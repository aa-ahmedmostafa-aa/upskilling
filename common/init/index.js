const initRoutes = require("./init-routes");
const connectMongoDB = require("./db/init-mongo");



/**
 * @function
 * Initializes app components
*
* @param {object} app - Express app.
*/
const init = async (app) => {
  initRoutes(app);
  connectMongoDB();
};

module.exports = init;
