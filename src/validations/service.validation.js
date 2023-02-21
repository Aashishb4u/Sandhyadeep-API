const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createService = {
  body: Joi.object().keys({
    name: Joi.string(),
    duration: Joi.string(),
    price: Joi.number(),
    type: Joi.string(),
    serviceType: Joi.string().custom(objectId),
  }),
};

const getServices = {
  query: Joi.object().keys({
    name: Joi.string(),
  }),
};

const getServiceById = {
  query: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

const getService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

const deleteService = {
  params: Joi.object().keys({
    serviceId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createService,
  getServices,
  getService,
  deleteService,
  getServiceById,
};
