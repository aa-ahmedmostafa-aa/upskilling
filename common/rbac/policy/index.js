const roles = require("../../enum/roles");
const adminPolicy = require("./adminPoicy");
const userPolicy = require("./userPolicy");

const opts = {
  [roles.ADMIN]: {
    can: adminPolicy,
  },
  [roles.USER]: {
    can: userPolicy,
  }
};


module.exports = opts