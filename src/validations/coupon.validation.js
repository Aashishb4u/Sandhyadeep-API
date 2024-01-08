const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCoupon = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    discountPercent: Joi.number().required(),
    couponLabel: Joi.string().required(),
    serviceTypes: Joi.array().required(),
    paymentMethods: Joi.array().required(),
    expiresOn: Joi.date().required(),
    minAmount: Joi.number().required(),
    maxDiscountAmount: Joi.number().required(),
  }),
};

const updateCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    discountPercent: Joi.number(),
    couponLabel: Joi.number(),
    serviceTypes: Joi.array(),
    expiresOn: Joi.date(),
    minAmount: Joi.number(),
    maxDiscountAmount: Joi.number(),
  }),
};

const getCoupons = {
  body: Joi.object().keys({
    services: Joi.array().required(),
    paymentMethods: Joi.array().required(),
  }),
};

const applyCoupon = {
  body: Joi.object().keys({
    services: Joi.array().required(),
    couponId: Joi.string().required(),
  }),
};

const getAllCoupons = {
  params: Joi.object().keys({
    couponId: Joi.string().custom(objectId),
  }),
};

const deleteCoupon = {
  params: Joi.object().keys({
    couponId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCoupon,
  getCoupons,
  getAllCoupons,
  deleteCoupon,
  updateCoupon,
  applyCoupon,
};
