const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const {authService, userService, tokenService, emailService, otpService, roleService} = require('../services');
const ApiError = require('../utils/ApiError');
const {tokenTypes} = require('../config/tokens');
const {handleSuccess} = require('../utils/SuccessHandler');
const constants = require('../utils/constants');

const register = catchAsync(async (req, res) => {
    let requestBody = req.body;
    const otpSuccess = await otpService.createOtp(requestBody);
    if (!otpSuccess) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Otp not created');
    }
    handleSuccess(httpStatus.CREATED, {oneTimeKey: otpSuccess.oneTimeKey}, constants.OTP_CREATED_SUCCESS, req, res);
});

const verifyOtp = catchAsync(async (req, res) => {
    const {mobileNo} = req.body;
    const {otp} = req.body;
    let verification = {
        isRegistered: false
    }
    const otpData = await otpService.getOtpByMobile(mobileNo);
    if (!otpData || otpData.otp !== otp) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Invalid OTP');
    }

    const user = await userService.getUserByNumber({mobileNo});
    let tokens = {};
    if (user) tokens = await tokenService.generateAuthTokens(user);
    if (user) verification.isRegistered = true;
    handleSuccess(httpStatus.OK, {verification, tokens, user}, constants.OTP_VERIFY_SUCCESS, req, res);
});

const resendOtp = catchAsync(async (req, res) => {
    let requestBody = req.body;
    const otpSuccess = await otpService.reGenerateOtp(requestBody);
    if (!otpSuccess) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Otp not created');
    }

    handleSuccess(httpStatus.OK, {}, constants.OTP_CREATED_SUCCESS, req, res);
});

const logout = catchAsync(async (req, res) => {
    await authService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
});

const login = catchAsync(async (req, res) => {
    const {email, password} = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = await tokenService.generateAuthTokens(user);
    res.send({user, tokens});
});

const refreshTokens = catchAsync(async (req, res) => {
    const tokens = await authService.refreshAuth(req.body.refreshToken);
    res.send({...tokens});
});

const signUpUser = catchAsync(async (req, res) => {
    const {oneTimeKey} = req.params;
    const verification = await otpService.verifyOneTimeKey(oneTimeKey);
    if (!verification) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Verification failed');
    }
    const role = await roleService.getRoleByName('customer');
    req.body.roleId = role._id;
    req.body.isActive = true;
    const user = await userService.createUser(req.body);
    if (!user) {
        throw new ApiError(httpStatus.BAD_GATEWAY, 'User not created');
    }

    const tokens = await tokenService.generateAuthTokens(user);
    handleSuccess(httpStatus.OK, {user, tokens}, constants.OTP_VERIFY_SUCCESS, req, res);

})


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
    signUpUser
};
