const Joi = require("joi");
// const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, "hexadecimal");

module.exports = {
  createRoomReviewSchema: {
    body: Joi.object()
      .required()
      .keys({
        roomId: Joi.string()
          .pattern(/^[0-9a-fA-F]{24}$/, "hexadecimal")
          .required(),
        review: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
      }),
  },
};
