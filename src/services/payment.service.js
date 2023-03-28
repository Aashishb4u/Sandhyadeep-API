const httpStatus = require('http-status');
const { Payment } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a serviceType
 * @param {Object} reqBody
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 */
const createPayment = async (reqBody) => {
  return Payment.create(reqBody);
};

module.exports = {
  createPayment,
};
