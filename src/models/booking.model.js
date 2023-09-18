const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const bookingSchema = mongoose.Schema(
  {
    services: [
      {
        serviceId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Service',
        },
        quantity: {
          type: Number,
        },
        price: {
          type: Number,
        },
      },
    ],
    packages: [
      {
        packageId: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: 'Package',
        },
        quantity: {
          type: Number,
        },
        discount: {
          type: Number,
        },
        finalAmount: {
          type: Number,
        },
        totalAmount: {
          type: Number,
        },
      },
    ],
    paymentId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Payment',
    },
    couponId: {
      default: null,
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Coupon',
    },
    couponDiscount: {
      default: 0,
      type: Number,
    },
    timeSlot: {
      type: String,
    },
    bookingDate: {
      type: String,
    },
    bookingOtp: {
      type: String,
    },
    status: {
      type: String,
      default: 'initiated'
    },
    ratings: {
      type: Number,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookingSchema.plugin(toJSON);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
