const Joi = require('joi');

const createSubService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    serviceType: Joi.string().required(),
  }),
};

const getSubServices = {
  query: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    page: Joi.any(),
    limit: Joi.any(),
  }),
};

const getAllSubServices = {
  query: Joi.object().keys({
    id: Joi.string(),
  }),
};

const getSubServiceById = {
  params: Joi.object().keys({
    subServiceId: Joi.string(),
  }),
};

const deleteSubService = {
  params: Joi.object().keys({
    subServiceId: Joi.string(),
  }),
};

module.exports = {
  createSubService,
  getSubServices,
  getSubServiceById,
  deleteSubService,
  getAllSubServices
};
