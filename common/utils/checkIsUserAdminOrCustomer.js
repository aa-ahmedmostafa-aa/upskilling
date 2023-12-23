const { roles } = require("../enum/roles");

const checkIsUserAdminOrCustomer = (user) => {
  const { role } = user;
  return role === roles.SUPER_ADMIN || role === roles.MODERATOR;
};

module.exports = checkIsUserAdminOrCustomer;
