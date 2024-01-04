const Joi = require("joi");

module.exports = {
  createRoomFacilitySchema: {
    body: Joi.object().required().keys({
      name: Joi.string().required(),
    }),
  },
  updateRoomFacilitySchema: {
    body: Joi.object().required().keys({
      name: Joi.string().required(),
    }),
  },
};
