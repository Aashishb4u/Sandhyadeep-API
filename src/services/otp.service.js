const randomatic = require("randomatic");
const { Otp } = require('../models');

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
    Object.assign(otp, otpBody);
    otp = await otp.save();
  } else {
    otp = await Otp.create(otpBody);
  }
  return otp;
};

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
  reGenerateOtp
};
