const randomatic = require("randomatic");
const { Otp } = require('../models');
const constants = require('../utils/constants');
const request = require('request-promise');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { User } = require('../models');

const createRandomOtp = async () => {
  const otp = randomatic("0", 4);
  //return otp;
  return "1234";
};

const createOtp = async (otpBody) => {
  const {mobileNo} = otpBody;
  otpBody.oneTimeKey = await randomatic("0", 8);
  otpBody.otp = await randomatic("0", 4);
  let otp = await getOtpByMobile(mobileNo);
  if (otp) {
    if (otp.otpCount >= 5) {
      throw new ApiError(httpStatus.TOO_MANY_REQUESTS, 'OTP Limit Exceeded');
    }
    otpBody.otpCount  = otp.otpCount + 1;
    Object.assign(otp, otpBody);
    otp = await otp.save();
  } else {
    otp = await Otp.create(otpBody);
  }
  return otp;
};

const sendOTP = async (otpBody) => {
  const {mobileNo, otp} = otpBody;
  try {
    return await request({
      method: 'GET',
      url: 'https://api.authkey.io/request',
      qs: {
        authkey: constants.AUTH_KEY,
        mobile: mobileNo,
        country_code: '+91',
        sid: '11267',
        otp: otp
      },
      json: true,
    });
  } catch (error) {
    // Handle errors, e.g., log or throw an exception
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Otp not sent');
  }

};

const refreshOtp = async (userId, refreshTokenDoc) => {
  const userData = await User.findById(userId);
  if(!userData) {
    if(refreshTokenDoc) await refreshTokenDoc.remove();
    throw new ApiError(httpStatus.NOT_FOUND, 'User not exist');
  }
  const {mobileNo} = userData;
  const otpBody = {otpCount: 0};
  let otp = await getOtpByMobile(mobileNo);
  Object.assign(otp, otpBody);
  return await otp.save();
}

const reGenerateOtp = async (otpBody) => {
  const {mobileNo} = otpBody;
  const otp = await getOtpByMobile(mobileNo);
  otpBody.oneTimeKey = await randomatic("0", 8);
  otpBody.otp = await randomatic("0", 4);
  Object.assign(otp, otpBody);
  await otp.save();
  return otp;
}

const verifyOneTimeKey = async (oneTimeKey) => {
  const otp = Otp.findOne({ oneTimeKey });
  return !!otp;
};

const getOtpByMobile = async (mobileNo) => {
  return Otp.findOne({ mobileNo })
};


module.exports = {
  createRandomOtp,
  createOtp,
  getOtpByMobile,
  verifyOneTimeKey,
  reGenerateOtp,
  sendOTP,
  refreshOtp
};
