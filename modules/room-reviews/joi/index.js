const Joi = require("joi");
const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/, "hexadecimal");

module.exports = {
  createRoomSchema: {
    body: Joi.object()
      .required()
      .keys({
        roomNumber: Joi.string().required(),
        price: Joi.number().required(),
        capacity: Joi.number().required(),
        discount: Joi.number().required(),
        facilities: Joi.array().items(objectIdSchema).required(),
      }),
  },
  updateRoomSchema: {
    body: Joi.object()
      .required()
      .keys({
        roomNumber: Joi.string().required(),
        price: Joi.number().required(),
        capacity: Joi.number().required(),
        discount: Joi.number().required(),
        facilities: Joi.array().items(objectIdSchema).required(),
      }),
  },
};
