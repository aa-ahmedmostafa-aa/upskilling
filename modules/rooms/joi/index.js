const Joi = require("joi");

module.exports = {
  createRoomSchema: {
    body: Joi.object()
      .required()
      .keys({
        roomNumber: Joi.string().required(),
        price: Joi.number().required(),
        capacity: Joi.number().required(),
        discount: Joi.number().required(),
        facilities: Joi.array().items(Joi.string()).required(),
        createdBy: Joi.string().required(),
      }),
  },
};
