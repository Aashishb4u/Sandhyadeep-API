const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPayment = {
  body: Joi.object().keys({
    name: Joi.string(),
    paymentAmount: Joi.number(),
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

const updatePayment = {
  body: Joi.object().keys({
    name: Joi.string(),
    paymentAmount: Joi.number(),
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
  verifyPayment,
};
