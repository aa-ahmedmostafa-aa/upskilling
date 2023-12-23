const { roles } = require("../enum/roles");

module.exports = (role) => {
  return role == roles.SUPER_ADMIN
    ? "Super Admin"
    : role == roles.MODERATOR
    ? "Moderator"
    : "Customer";
};
