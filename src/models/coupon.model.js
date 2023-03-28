const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    discountPrice: {
      type: Number,
    },
    description: {
      type: String,
    },
    expiresOn: {
      type: String,
    },
    couponLabel: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
couponSchema.plugin(toJSON);

const coupon = mongoose.model('coupon', couponSchema);
module.exports = coupon;
