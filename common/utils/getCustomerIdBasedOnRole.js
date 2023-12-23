const { roles } = require("../enum/roles");
const _ = require("lodash");

const getCustomerIdBasedOnRole = (req) => {
  const { user, params, body, query } = req;
  const { role } = user;
  if (role === roles.CUSTOMER) {
    return _.get(user, "id", null);
  } else if (role === roles.SUPER_ADMIN || role === roles.MODERATOR) {
    let isValid = false;
    if (params && (params.customerId || params.id)) {
      isValid = true;
      return params.customerId || params.id;
    } else if (body && body.customerId) {
      isValid = true;
      return body.customerId;
    } else if (query && query.customerId) {
      isValid = true;
      return query.customerId;
    }
    if (!isValid) {
      return undefined;
    }
  }
};

module.exports = getCustomerIdBasedOnRole;
