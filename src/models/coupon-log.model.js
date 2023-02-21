const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const couponLogSchema = mongoose.Schema(
  {
    coupon: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Coupon',
    },
    booking: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Booking',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
couponLogSchema.plugin(toJSON);

const CouponLog = mongoose.model('CouponLog', couponLogSchema);
module.exports = CouponLog;
