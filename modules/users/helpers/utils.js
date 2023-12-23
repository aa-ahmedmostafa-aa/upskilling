const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../common/config/configuration");

class Utils {
  static validatePassword = (enteredPassword, password) => {
    return bcrypt.compare(enteredPassword, password);
  };

  static generateJWT = ({ id, role, verified, adminGroup, userType }) => {
    return jwt.sign(
      { id, role, verified, adminGroup, userType },
      config.jwt.key,
      {
        algorithm: "HS256",
        expiresIn: config.jwt.expire,
      }
    );
  };

  static toAuthJSON = (user) => {
    const { id, role, verified, adminGroup, userType } = user;
    const token = this.generateJWT({
      id,
      role,
      verified,
      adminGroup,
      userType,
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
