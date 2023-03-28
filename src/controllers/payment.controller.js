const httpStatus = require('http-status');
const RazorPay = require('razorpay');
const moment = require('moment');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { paymentService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { picUpload } = require('../utils/fileUpload');
const pick = require('../utils/pick');

const createPayment = catchAsync(async (req, res) => {
  const { amount } = req.body;
  console.log(req.body);
  const instance = new RazorPay({
    key_id: 'rzp_test_uPxCJhIQrZ46rn',
    key_secret: 'R9NUbTbYQ3CRsK2flKo47J3b',
  });

  const order = await instance.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt-${moment().format('YYMMDD')}`,
  });

  res.status(httpStatus.CREATED).send(order);
});

module.exports = {
  createPayment,
};
