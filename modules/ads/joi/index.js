const Joi = require("joi");

module.exports = {
  createAdsSchema: {
    body: Joi.object().required().keys({
      room: Joi.string().required(),
      discount: Joi.number().positive().required(),
    }),
  },
  updateAdsSchema: {
    body: Joi.object().required().keys({
      isActive: Joi.boolean().required(),
    }),
  },
};
