const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, otpService, roleService } = require('../services');
const ApiError = require('../utils/ApiError');
const { tokenTypes } = require('../config/tokens');
const { handleSuccess } = require('../utils/SuccessHandler');
const messages = require('../utils/constants');

const register = catchAsync(async (req, res) => {
  let user = await userService.getUserByNumber(req.body);
  if (!user) {
    const otp = await otpService.createRandomOtp();
    const role = await roleService.getRoleByName('customer');
    req.body.roleId = role._id;
    req.body.otp = otp;
    user = await userService.createUser(req.body);
  }
  handleSuccess(httpStatus.CREATED, { user }, messages.USER_ADDED_SUCCESS, req, res);
  res.status(httpStatus.CREATED).send({ user });
});

const verifyOtp = catchAsync(async (req, res) => {
  const { userId } = req.body;
  const { otp } = req.body;
  const user = await userService.getUserById(userId);
  if (user.otp !== otp) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
  }
  const tokens = await tokenService.generateAuthTokens(user);
  handleSuccess(httpStatus.OK, { user, tokens }, messages.OTP_VERIFY_SUCCESS, req, res);
});

const resendOtp = catchAsync(async (req, res) => {
  const user = await userService.getUserByNumber(req.body);
  const newOtp = await otpService.createRandomOtp();
  await userService.updateUserById(user.id, { otp: newOtp });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.status(httpStatus.CREATED).send({ otp: newOtp, userId: user._id });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  resendOtp,
  verifyOtp,
};
