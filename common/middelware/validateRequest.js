const { StatusCodes } = require("http-status-codes");
module.exports = (schema) => {
  return (req, res, next) => {
    const validations = [];
    [("headers", "params", "query", "body", "file")].forEach((key) => {
      if (schema[key]) {
        const validation = schema[key].validate(req[key]);
        if (validation.error) {
          validations.push(
            validation.error.details[0].message.split('"').join("")
          );
        }
      }
    });
    if (validations.length) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: validations.join() });
      return;
    } else {
      next();
    }
  };
};
