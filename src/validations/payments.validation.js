const Joi = require('joi');
const { objectId } = require('./custom.validation');

const initiatePayment = {
  body: Joi.object().keys({
    paymentAmount: Joi.number()
  })
}

const createPayment = {
  body: Joi.object().keys({
    name: Joi.string(),
    paymentAmount: Joi.number(),
    paymentMethod: Joi.string(),
    paymentDate: Joi.string(),
    description: Joi.number(),
    currency: Joi.string(),
    paymentStatus: Joi.string(),
    signatureVerification: Joi.boolean(),
    userId: Joi.string().custom(objectId),
    razorpay_payment_id: Joi.any(),
    razorpay_order_id: Joi.any(),
    razorpay_signature: Joi.any(),
  }),
};

const addTransactionLog = {
  body: Joi.object().keys({
    services: Joi.any(),
    packages: Joi.any(),
    couponId: Joi.string().allow(null).custom(objectId),
    couponDiscount: Joi.any(),
    timeSlot: Joi.string(),
    bookingDate:  Joi.any(),
    userId: Joi.string().custom(objectId),
    paymentAmount: Joi.number(),
    razorpayOrderId: Joi.string(),
    paymentMethod: Joi.string(),
    paymentReceiptId: Joi.string(),
    paymentDate: Joi.string(),
  })
}

const updatePayment = {
  body: Joi.object().keys({
    name: Joi.string(),
    paymentAmount: Joi.number(),
    paymentMethod: Joi.string(),
    paymentDate: Joi.string(),
    description: Joi.number(),
    currency: Joi.string(),
    paymentStatus: Joi.string(),
    razorpayPaymentId: Joi.string(),
    razorpayOrderId: Joi.string(),
    razorpaySignature: Joi.string(),
    userId: Joi.string().custom(objectId),
    razorpay_payment_id: Joi.any(),
    razorpay_order_id: Joi.any(),
    razorpay_signature: Joi.any(),
  }),
};

const verifyPayment = {
  body: Joi.object().keys({
    razorpay_payment_id: Joi.any(),
    razorpay_order_id: Joi.any(),
    razorpay_signature: Joi.any(),
  }),
};

const refundPayment = {
  params: Joi.object().keys({
    paymentId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    razorpay_payment_id: Joi.any(),
    razorpay_order_id: Joi.any(),
    razorpay_signature: Joi.any(),
  }),
};

module.exports = {
  createPayment,
  updatePayment,
  refundPayment,
  verifyPayment,
  initiatePayment,
  addTransactionLog
};
