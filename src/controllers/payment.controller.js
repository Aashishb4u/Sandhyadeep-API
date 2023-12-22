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

const createOnlinePayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  const instance = new RazorPay({
    key_id: constants.RAZORPAY_TEST_KEY,
    key_secret: constants.RAZORPAY_TEST_SECRET,
  });
  const order = await instance.orders.create({
    amount: requestBody.paymentAmount * 100,
    currency: 'INR',
    receipt: `receipt-${moment().format('YYMMDDhmmss')}`,
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

const initiatePayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  const instance = new RazorPay({
    key_id: constants.RAZORPAY_TEST_KEY,
    key_secret: constants.RAZORPAY_TEST_SECRET,
  });

  const order = await instance.orders.create({
    amount: requestBody.paymentAmount * 100,
    currency: 'INR',
    receipt: `receipt-${moment().format('YYMMDDhmmss')}`,
  });

  handleSuccess(httpStatus.CREATED,
    {
      razorpayOrderId: order.id,
      paymentReceiptId: order.receipt,
      paymentAmount: requestBody.paymentAmount
    }, 'Payment is Initiated.', req, res);
});

const addTransactionLog = catchAsync(async (req, res) => {
  const requestBody = req.body;
  paymentService.createTransactionLog(requestBody).then((response) => {
    handleSuccess(httpStatus.CREATED, response, 'Transaction created Successfully', req, res);
  });
});

const createOfflinePayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  requestBody.paymentStatus = 'pending';
  requestBody.paymentReceiptId = `receipt-${moment().format('YYMMDDhmmss')}`;
  paymentService.createPayment(requestBody).then((paymentResponse) => {
    handleSuccess(httpStatus.CREATED, paymentResponse, 'Payment is Initiated.', req, res);
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  const { paymentId } = req.params;
  const hashKey = `${requestBody.razorpay_order_id}|${requestBody.razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', constants.RAZORPAY_TEST_SECRET)
    .update(hashKey.toString())
    .digest('hex');

  // verify Signature
  if (expectedSignature !== requestBody.razorpay_signature) {
    handleError(httpStatus.FORBIDDEN, 'Payment not authorised and rejected', req, res, '');
    return;
  }

  handleSuccess(httpStatus.CREATED,
    {signatureVerification: requestBody.razorpay_signature},
    'Payment is verified and completed.', req, res);
});

const refundPayment = catchAsync(async (req, res) => {
  const requestBody = req.body;
  const {razorPaymentId} = req.body.razorpay_payment_id;
  const { paymentId } = req.params;

  // First we need to validate Payment
  const payment = await paymentService.getPaymentById(paymentId);
  if (!payment) {
    handleError(httpStatus.NOT_FOUND, 'Transaction verified but Payment not found', req, res, '');
    return;
  }
  const instance = new RazorPay({
    key_id: constants.RAZORPAY_TEST_KEY,
    key_secret: constants.RAZORPAY_TEST_SECRET,
  });
  const order = await instance.refund({
    amount: requestBody.paymentAmount * 100,
    payment_id: razorPaymentId
  });
  console.log(order);
  // paymentService.updatePayment(paymentId, requestBody).then((paymentResponse) => {
  //   handleSuccess(httpStatus.CREATED, paymentResponse, 'Payment is verified and completed.', req, res);
  // });
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
  requestBody.paymentStatus = 'paid';
  paymentService.updatePayment(paymentId, requestBody).then((paymentResponse) => {
    handleSuccess(httpStatus.CREATED, { paymentResponse }, 'Payment is completed and saved.', req, res);
  });
});

const verificationFailed = catchAsync(async (req, res) => {
  console.log(req.body);
  require('fs').writeFileSync('payment-failed-2.json', JSON.stringify(req.body, null, 4))
  res.json({ status: 'ok' });
});

const verificationSuccessHook = catchAsync(async (req, res) => {
  const expectedSignature = crypto
      .createHmac('sha256', constants.RAZORPAY_TEST_SECRET)
      .update(JSON.stringify(req.body))
      .digest('hex');

  if (expectedSignature === req.headers['x-razorpay-signature']) {
    const requestBody = req.body;
    if (requestBody && requestBody.event && requestBody.event === 'payment.captured') {
      const orderId = requestBody.payload.payment.entity.order_id;
      const payment = await paymentService.getPaymentByOrderId(orderId);
      if (!payment) {
        handleError(httpStatus.NOT_FOUND, 'Payment not found', req, res, '');
        return;
      }
      payment.paymentDate = moment().format('DD/MM/YYYY');
      payment.signatureVerification = true;
      payment.paymentStatus = 'paid';
      console.log(payment);
      paymentService.updatePaymentByOrderId(orderId, payment).then((paymentResponse) => {
        console.log(paymentResponse);
      });
      require('fs').writeFileSync('payment2.json', JSON.stringify(req.body, null, 4))
    }
  } else {
    handleError(httpStatus.FORBIDDEN, 'Payment not authorised and rejected', req, res, '');
    return;
  }
  res.json({ status: 'ok' });
})

module.exports = {
  createOnlinePayment,
  createOfflinePayment,
  updatePayment,
  verifyPayment,
  refundPayment,
  verificationSuccessHook,
  verificationFailed,
  initiatePayment,
  addTransactionLog
};
