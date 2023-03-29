const httpStatus = require('http-status');
const crypto = require('crypto');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');
// var { validatePaymentVerification } = require('./dist/utils/razorpay-utils');
const constants = require('../utils/constants');

/**
 * Create a serviceType
 * @param {Object} reqBody
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 */
const createPayment = async (reqBody) => {
  return Payment.create(reqBody);
};

const getPaymentById = async (id) => {
  return Payment.findById(id);
};

const updatePayment = async (paymentId, updateBody) => {
  const payment = await getPaymentById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid Payment');
  }
  Object.assign(payment, updateBody);
  await payment.save();
  return payment;
};

module.exports = {
  createPayment,
  updatePayment,
  getPaymentById,
};
