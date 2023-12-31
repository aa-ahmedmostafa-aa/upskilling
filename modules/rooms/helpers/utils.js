const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../common/config/configuration");

class Utils {
  static validatePassword = (enteredPassword, password) => {
    return bcrypt.compare(enteredPassword, password);
  };

  static generateJWT = ({ _id, role, verified }) => {
    return jwt.sign({ _id, role, verified }, config.jwt.key, {
      algorithm: "HS256",
      expiresIn: config.jwt.expire,
    });
  };

  static toAuthJSON = (user) => {
    const { _id, role, verified } = user;
    const token = this.generateJWT({
      _id: _id,
      role,
      verified,
    });
    return {
      token: `Bearer ${token}`,
    };
  };

  static formatUpdatedPayload = (payload) => {
    const updatedPayload = {};
    if (payload.fullName) {
      updatedPayload.fullName = payload.fullName;
    }
    if (payload.userName) {
      updatedPayload.userName = payload.userName;
    }
    if (payload.email) {
      updatedPayload.email = payload.email;
    }
    if (payload.phoneNumber) {
      updatedPayload.phoneNumber = payload.phoneNumber;
    }
    if (payload.password) {
      updatedPayload.password = payload.password;
    }
    if (payload.adminGroupId) {
      updatedPayload.admin_group_id = payload.adminGroupId;
    }

    return updatedPayload;
  };

  static formatSearchOptions = (query) => {
    const searchOptions = {};
    if (query.role) {
      searchOptions.role = query.role;
    }

    return searchOptions;
  };
}

module.exports = Utils;
