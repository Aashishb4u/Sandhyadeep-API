const Joi = require('joi');

const createPayment = {
  body: Joi.object().keys({
    name: Joi.string(),
    amount: Joi.number(),
    description: Joi.number(),
    currency: Joi.string(),
  }),
};

module.exports = {
  createPayment,
};
