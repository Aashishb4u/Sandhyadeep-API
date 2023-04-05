const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    razorpayPaymentId: {
      default: null,
      type: String,
    },
    razorpayOrderId: {
      default: null,
      type: String,
    },
    razorpaySignature: {
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
    signatureVerification: {
      default: false,
      type: Boolean,
    },
    paymentStatus: {
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
paymentSchema.plugin(toJSON);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
