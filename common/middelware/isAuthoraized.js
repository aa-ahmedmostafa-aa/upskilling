const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const rbac = require("../rbac/rbac");
const config = require("../config/configuration");
const ErrorResponse = require("../utils/errorResponse");

module.exports = (endPoint) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      if (
        !req.headers.authorization ||
        !req.headers.authorization.startsWith("Bearer")
      ) {
        return next(
          new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED)
        );
      }
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return next(
          new ErrorResponse("Unauthorized", StatusCodes.UNAUTHORIZED)
        );
      }
      if (token) {
        try {
          const decoded = jwt.verify(token, config.jwt.key);
          req.user = decoded;
          const isAllowed = await rbac.can(req.user.role, endPoint);
          if (isAllowed) {
            next();
          } else {
            res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ message: "Unauthorized" });
          }
        } catch (error) {
          res.json({ message: error });
        }
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
  };
};
