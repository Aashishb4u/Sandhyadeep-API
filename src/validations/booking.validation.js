const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBooking = {
  body: Joi.object().keys({
    services: Joi.any(),
    packages: Joi.any(),
    paymentId: Joi.string().custom(objectId).required(),
    couponId: Joi.any(),
    timeSlot: Joi.string().required(),
    bookingDate: Joi.string().required(),
    ratings: Joi.number(),
    isCancelled: Joi.boolean(),
    status: Joi.string(),
    keywordUrl: Joi.string(),
  }),
};

const updateBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    services: Joi.any(),
    packages: Joi.any(),
    paymentId: Joi.string().custom(objectId),
    couponId: Joi.any(),
    timeSlot: Joi.string(),
    bookingDate: Joi.string(),
    ratings: Joi.number(),
    isCancelled: Joi.boolean(),
    status: Joi.string(),
  }),
};

const cancelBooking = {
  params: Joi.object().keys({
    bookingId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    services: Joi.any(),
    packages: Joi.any(),
    paymentId: Joi.string().custom(objectId),
    couponId: Joi.any(),
    timeSlot: Joi.string(),
    bookingDate: Joi.string(),
    ratings: Joi.number(),
    isCancelled: Joi.boolean(),
    status: Joi.string(),
  }),
};

const getBookings = {
  query: Joi.object().keys({
    id: Joi.string(),
  }),
};

const getUserBookings = {
  query: Joi.object().keys({
    id: Joi.string(),
  }),
};

const getBookingById = {
  params: Joi.object().keys({
    subServiceId: Joi.string(),
  }),
};

const deleteBooking = {
  params: Joi.object().keys({
    subServiceId: Joi.string(),
  }),
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
  updateBooking,
  getUserBookings,
  cancelBooking,
};
