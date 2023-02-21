const randomatic = require("randomatic");

const createRandomOtp = async () => {
  const otp = randomatic("0", 4);
  //return otp;
  return "1234";
};


module.exports = {
  createRandomOtp,
};
