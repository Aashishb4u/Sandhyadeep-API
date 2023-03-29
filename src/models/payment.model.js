const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const paymentSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    paymentAmount: {
      type: Number,
    },
    paymentDate: {
      type: String,
    },
    signatureVerification: {
      type: Boolean,
    },
    paymentStatus: {
      type: String,
    },
    paymentReceiptId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);

const payment = mongoose.model('payment', paymentSchema);
module.exports = payment;
