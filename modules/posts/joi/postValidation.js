const Joi = require("joi");

module.exports = {
  addPostSchema: {
    body: Joi.object().required().keys({
      title: Joi.string().required(),
      content: Joi.string().required(),
      createdBy: Joi.string().required(),
    }),
    file: Joi.object().required(),
  },
};
