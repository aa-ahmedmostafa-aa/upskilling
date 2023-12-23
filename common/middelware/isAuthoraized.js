const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const rbac = require("../rbac/rbac");

module.exports = (endPoint) => {
  return async (req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token) {
        try {
          const decoded = jwt.verify(token, "shhhhh");
          req.user = decoded;
          const isAllowed = await rbac.can(req.user.role, endPoint);
          if (isAllowed) {
            next();
          } else {
            res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ message: "unauthoraized" });
          }
        } catch (error) {
          res.json({ message: error });
        }
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "unauthoraized" });
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "unauthoraized ****" });
    }
  };
};
