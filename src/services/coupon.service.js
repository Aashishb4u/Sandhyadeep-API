const httpStatus = require('http-status');
const { Coupon } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCoupon = async (userBody) => {
  return Coupon.create(userBody);
};

const getAllCoupons = async () => {
  return Coupon.find({});
};

const getCouponByCouponLabel = async (name) => {
  return Coupon.findOne({ couponLabel: name });
};

const getCouponById = async (id) => {
  return Coupon.findOne({ _id: id });
};

const deleteCouponById = async (roleId) => {
  const role = await getCouponById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Coupon not found');
  }
  await role.remove();
  return role;
};

const getApplicableCoupons = async (services) => {
  return Coupon.find({
    serviceTypes: { $in: services.map((service) => service.serviceType) },
    expiresOn: { $gte: Date.now() }, // apply condition to check if coupon is expired
    minAmount: { $lte: services.reduce((total, service) => total + service.price * service.counter, 0) }, // apply condition to check if minimum amount criteria is met
  });
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponByCouponLabel,
  getCouponById,
  getApplicableCoupons,
  deleteCouponById,
};
