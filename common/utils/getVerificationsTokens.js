const jwt = require("jsonwebtoken");
const config = require("../config/configuration");
const getVerificationsTokens = (customer) => {
  const verificationToken = jwt.sign(
    { id: customer.id, type: "Verify" },
    config.jwt.key,
    {
      algorithm: "HS256",
    }
  );
  const verificationTokenExpiration = Date.now() + Math.abs(3600000 * 4);

  return {
    verificationToken,
    verificationTokenExpiration,
  };
};

const getResetPasswordTokens = (customer) => {
  const resetPasswordToken = jwt.sign(
    { id: customer.id, type: "Verify" },
    config.jwt.key,
    {
      algorithm: "HS256",
    }
  );
  const resetPasswordExpiration = Date.now() + Math.abs(3600000 * 4);

  return {
    resetPasswordToken,
    resetPasswordExpiration,
  };
};

module.exports = {
  getVerificationsTokens,
  getResetPasswordTokens,
};
