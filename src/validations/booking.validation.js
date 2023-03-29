const Joi = require('joi');

const createBooking = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    serviceType: Joi.string().required(),
  }),
};

const getBookings = {
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
};
