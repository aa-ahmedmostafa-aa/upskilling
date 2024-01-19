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
        confirmPassword: Joi.string()
          .required()
          .valid(Joi.ref("password"))
          .required()
          .messages({
            "any.only": "Confirm password does not match password",
          }),
        phoneNumber: Joi.string()
          .pattern(/^01[0-9]{9}$/)
          .message("Phone number must start with 01 and be 11 digits in total"),
        role: Joi.string().valid(userTypes.ADMIN, userTypes.USER).required(),
      }),
  },

  singInSchema: {
    body: Joi.object().required().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  },
  userForgotPasswordSchema: {
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
      })
      .required(),
  },

  userChangePasswordSchema: {
    body: Joi.object()
      .keys({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().required(),
        confirmPassword: Joi.string()
          .required()
          .valid(Joi.ref("newPassword"))
          .required()
          .messages({
            "any.only": "Confirm password does not match newPassword",
          }),
      })
      .required(),
  },
  userPasswordResetSchema: {
    body: Joi.object()
      .keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string()
          .required()
          .valid(Joi.ref("password"))
          .required()
          .messages({
            "any.only": "Confirm password does not match password",
          }),
        seed: Joi.string().required(),
      })
      .required(),
  },

  updateUserSchema: {
    params: Joi.object().required().keys({
      id: Joi.string(),
    }),
    body: Joi.object().required().keys({
      name: Joi.string().required(),
    }),
  },
  socialGoogleLoginSchema: {
    body: Joi.object().required().keys({
      accessToken: Joi.string().required(),
    }),
  },
  socialFacebookLoginSchema: {
    body: Joi.object().required().keys({
      accessToken: Joi.string().required(),
      userID: Joi.string().required(),
    }),
  },
};
