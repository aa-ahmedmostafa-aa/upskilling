const Joi = require("joi");

module.exports = {
  createAdsSchema: {
    body: Joi.object().required().keys({
      room: Joi.string().required(),
      discount: Joi.number().positive().required(),
      isActive: Joi.boolean().required(),
    }),
  },
  updateAdsSchema: {
    body: Joi.object().required().keys({
      discount: Joi.number().positive().required(),
      isActive: Joi.boolean().required(),
    }),
  },
};
