const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { couponService } = require('../services');

const createCoupon = catchAsync(async (req, res) => {
  const role = await couponService.createCoupon(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getCoupons = catchAsync(async (req, res) => {
  const result = await couponService.getAllCoupons();
  res.send(result);
});

const getCoupon = catchAsync(async (req, res) => {
  const role = await couponService.getCouponById(req.params.couponId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  res.send(role);
});

const deleteCoupon = catchAsync(async (req, res) => {
  await couponService.deleteCouponById(req.params.couponId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  deleteCoupon,
};
