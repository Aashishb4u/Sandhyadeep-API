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

const getCouponByName = async (rollName) => {
  return Coupon.findOne({ name: rollName });
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
module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponByName,
  getCouponById,
  deleteCouponById,
};
