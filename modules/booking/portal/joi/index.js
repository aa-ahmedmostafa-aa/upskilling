const Joi = require("joi");

module.exports = {
  createBookingSchema: {
    body: Joi.object().required().keys({
      totalPrice: Joi.number().required(),
      startDate: Joi.date().required(),
      endDate: Joi.date().required(),
      room: Joi.string().required(),
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
        facilities: Joi.array().items(Joi.string()).required(),
      }),
  },
};
