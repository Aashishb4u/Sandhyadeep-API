const httpStatus = require('http-status');
const RazorPay = require('razorpay');
const moment = require('moment');
const crypto = require("crypto");
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { picUpload } = require('../utils/fileUpload');
const pick = require('../utils/pick');
const constants = require('../utils/constants');

const createPayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  const instance = new RazorPay({
    key_id: constants.RAZORPAY_TEST_KEY,
    key_secret: constants.RAZORPAY_TEST_SECRET,
  });

  const order = await instance.orders.create({
    amount: requestBody.paymentAmount * 100,
    currency: 'INR',
    receipt: `receipt-${moment().format('YYMMDD')}`,
  });
  if (!order) {
    handleError(httpStatus.FORBIDDEN, 'Payment initialisation is failed', req, res);
  }
  requestBody.razorpayOrderId = order.id;
  requestBody.paymentReceiptId = order.receipt;
  paymentService.createPayment(requestBody).then((paymentResponse) => {
    handleSuccess(httpStatus.CREATED, paymentResponse, 'Payment is Initiated.', req, res);
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  const hashKey = `${requestBody.razorpay_order_id}|${requestBody.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', constants.RAZORPAY_TEST_SECRET)
    .update(hashKey.toString())
    .digest('hex');
  if (expectedSignature !== requestBody.razorpay_signature) {
    handleError(httpStatus.FORBIDDEN, 'Payment not authorised and rejected', req, res, '');
    return;
  }

  const responseData = {
    signatureVerification: true,
    ...requestBody,
  };
  handleSuccess(httpStatus.CREATED, responseData, 'Payment is verified and authorised.', req, res);
});

const updatePayment = catchAsync(async (req, res) => {
  const { paymentId } = req.params;
  const payment = await paymentService.getPaymentById(paymentId);
  if (!payment) {
    handleError(httpStatus.NOT_FOUND, 'Payment not found', req, res, '');
    return;
  }
  let requestBody = req.body;
  requestBody.paymentDate = moment().format('DD/MM/YYYY');
  requestBody.signatureVerification = true;
  requestBody.paymentStatus = 'completed';
  paymentService.updatePayment(paymentId, requestBody).then((paymentResponse) => {
    handleSuccess(httpStatus.CREATED, { paymentResponse }, 'Payment is completed and saved.', req, res);
  });
});

module.exports = {
  createPayment,
  updatePayment,
  verifyPayment,
};
