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
    timeSlot: {
      type: String,
    },
    bookingDate: {
      type: String,
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
