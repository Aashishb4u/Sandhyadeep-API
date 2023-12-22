const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const transactionLogs = mongoose.Schema(
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
    status: {
      type: String,
      default: 'failed',
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    razorpayOrderId: {
      default: null,
      type: String,
    },
    paymentAmount: {
      default: 0,
      type: Number,
      required: true,
    },
    paymentDate: {
      type: String,
    },
    paymentReceiptId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transactionLogs.plugin(toJSON);

const TransactionLog = mongoose.model('TransactionLog', transactionLogs);
module.exports = TransactionLog;
