const Joi = require('joi');

const createServiceType = {
  body: Joi.object().keys({
    name: Joi.string(),
    imageFile: Joi.any(),
  }),
};

const getServiceTypes = {
  query: Joi.object().keys({
    name: Joi.string(),
    sequence: Joi.number(),
  }),
};

const getServiceTypeById = {
  params: Joi.object().keys({
    serviceTypeId: Joi.string(),
  }),
};

const deleteServiceType = {
  params: Joi.object().keys({
    serviceTypeId: Joi.string(),
  }),
};

module.exports = {
  createServiceType,
  getServiceTypes,
  getServiceTypeById,
  deleteServiceType,
};
