const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
  {
    mobileNo: {
      type: String,
      required: true,
      unique: true,
      default: '',
    },
    otp: {
      type: String,
      required: true,
      default: '',
    },
    oneTimeKey: {
      type: String,
      required: true,
      default: '',
    },
    otpCount: {
      type: Number,
      default: 1,
      required: true,
    }
  });

const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;
