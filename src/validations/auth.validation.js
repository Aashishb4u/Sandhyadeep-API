const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    mobileNo: Joi.string().required(),
  }),
};

const resendOtp = {
  body: Joi.object().keys({
    mobileNo: Joi.string().required(),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    mobileNo: Joi.string().required(),
    otp: Joi.string().required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const signUp = {
  params: Joi.object().keys({
    oneTimeKey: Joi.any().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    dateOfBirth: Joi.string(),
    mobileNo: Joi.any(),
  })
}

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyOtp,
  resendOtp,
  signUp
};
