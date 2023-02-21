const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCoupon = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    discountPrice: Joi.number().required(),
  }),
};

const getCoupons = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const getCoupon = {
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
  getCoupon,
  deleteCoupon,
};
