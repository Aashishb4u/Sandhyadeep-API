const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const couponSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },
    discountPercent: {
      type: Number,
    },
    minAmount: {
      type: Number,
    },
    maxDiscountAmount: {
      type: Number,
    },
    serviceTypes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ServiceType',
      },
    ],
    expiresOn: {
      type: Date,
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
