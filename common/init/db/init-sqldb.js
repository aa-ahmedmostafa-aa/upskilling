/* eslint global-require: "error" */
/* eslint-env es6 */
// eslint-disable-next-line global-require

const { Sequelize } = require("sequelize");
const logger = require("../../config/logger");
const { mysql } = require("../../config/configuration");

const config = {};

config.username = mysql.username;
config.password = mysql.password;
config.database = mysql.database;
config.host = mysql.host;
config.logging = false;
if (process.env.NODE_ENV == "dev") {
  config.logging = true;
}
config.dialectOptions = {
  decimalNumbers: true,
};

// config.query = { raw: true };
// config.define = {
//   charset: 'utf8',
//   collate: 'utf8_unicode_ci',
// };

if (process.env.NODE_ENV == "development") {
  config.dialect = "sqlite";
  config.storage = ":memory:";
} else {
  config.dialect = "mysql";
}

config.define = {
  freezeTableName: true,
};

config.pool = {
  max: 100,
  min: 0,
  acquire: 30000,
  idle: 10000,
};

config.retry = {
  match: [
    /ETIMEDOUT/,
    /EHOSTUNREACH/,
    /ECONNRESET/,
    /ECONNREFUSED/,
    /ETIMEDOUT/,
    /ESOCKETTIMEDOUT/,
    /EHOSTUNREACH/,
    /EPIPE/,
    /EAI_AGAIN/,
    /SequelizeConnectionError/,
    /SequelizeConnectionRefusedError/,
    /SequelizeHostNotFoundError/,
    /SequelizeHostNotReachableError/,
    /SequelizeInvalidConnectionError/,
    /SequelizeConnectionTimedOutError/,
  ],
  max: 5,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

sequelize
  .authenticate()
  .then(() => {
    logger.info(
      "[Trade App][sequelize.js] Sequelize connection has been established successfully."
    );
  })
  .catch((err) => {
    logger.error(
      "[sequelize.js] Sequelize is unable to connect to the database:",
      err
    );
  });

module.exports = sequelize;
