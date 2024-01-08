const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { couponService, serviceService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { Service } = require('../models');

const createCoupon = catchAsync(async (req, res) => {
  const coupon = await couponService.createCoupon(req.body);
  handleSuccess(httpStatus.CREATED, coupon, 'Coupon created Successfully.', req, res);
});

const getCoupons = catchAsync(async (req, res) => {
  try {
    const serviceDetails = req.body.services;
    const {paymentMethods} = req.body;
    const serviceIds = serviceDetails.map((service) => service.id);

    const services = await Service.find({ _id: { $in: serviceIds } })
      .populate('subService')
      .exec();

    const updatedServices = services.map((service) => {
      const foundService = serviceDetails.find((sd) => sd.id === service.id);
      return { ...service.toObject(), counter: foundService.counter };
    });

    const coupons = await couponService.getApplicableCoupons(updatedServices, paymentMethods);
    handleSuccess(httpStatus.OK, coupons, 'All Applicable Coupons.', req, res);
  } catch (err) {
    handleError(httpStatus.INTERNAL_SERVER_ERROR, 'Server Error', req, res);
  }
});

const getAllCoupons = catchAsync(async (req, res) => {
  const result = await couponService.getAllCoupons();
  res.send(result);
});

const getCouponById = catchAsync(async (req, res) => {
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

const applyCoupon = catchAsync(async (req, res) => {
  // const serviceIds = req.body.services; // assuming the request body contains an array of service IDs

  try {
    const serviceDetails = req.body.services;
    const { couponId } = req.body; // assuming the request body contains a "couponCode" property with the code for the coupon to apply
    const serviceIds = serviceDetails.map((service) => service.id);

    const services = await Service.find({ _id: { $in: serviceIds } })
      .populate('subService')
      .exec();

    const updatedServices = services.map((service) => {
      const foundService = serviceDetails.find((sd) => sd.id === service.id);
      return { ...service.toObject(), counter: foundService.counter };
    });

    // Retrieve the coupon with the provided code
    const coupon = await couponService.getCouponById(couponId);

    if (!coupon) {
      handleError(httpStatus.INTERNAL_SERVER_ERROR, 'Coupon not found', req, res);
    }

    // Check if the coupon is expired
    if (coupon.expiresOn < Date.now()) {
      handleError(httpStatus.INTERNAL_SERVER_ERROR, 'Coupon is expired.', req, res);
    }

    // Check if the minimum amount criteria is met
    const totalAmount = updatedServices.reduce((total, service) => total + service.price * service.counter, 0);
    if (coupon.minAmount && totalAmount < coupon.minAmount) {
      handleError(httpStatus.INTERNAL_SERVER_ERROR, 'Minimum amount criteria not met for coupon', req, res);
    }

    let discountAmount = Math.round((totalAmount * coupon.discountPercent) / 100);
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
    const discountedAmount = totalAmount - discountAmount;

    // Return the discounted amount
    handleSuccess(
      httpStatus.OK,
      { coupon, totalAmount, discountedAmount, discountAmount },
      'Coupon Applied SuccessFully.',
      req,
      res
    );
  } catch (err) {
    handleError(httpStatus.INTERNAL_SERVER_ERROR, 'Server Error', req, res);
  }
});

module.exports = {
  createCoupon,
  getCoupons,
  getCouponById,
  deleteCoupon,
  getAllCoupons,
  applyCoupon,
};
