const Joi = require("joi");
const { userTypes } = require("../helpers/constants");

module.exports = {
  signUpSchema: {
    body: Joi.object()
      .required()
      .keys({
        userName: Joi.string().required(),
        country: Joi.string().required(),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
        phoneNumber: Joi.number().required(),
        role: Joi.string().valid(userTypes.ADMIN, userTypes.USER).required(),
      }),
  },
  singInSchema: {
    body: Joi.object().required().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  },

  updateUserSchema: {
    params: Joi.object().required().keys({
      id: Joi.string(),
    }),
    body: Joi.object().required().keys({
      name: Joi.string().required(),
    }),
  },
};
