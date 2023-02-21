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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
couponSchema.plugin(toJSON);

const coupon = mongoose.model('coupon', couponSchema);
module.exports = coupon;
