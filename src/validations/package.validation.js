const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createPackage = {
  body: Joi.object().keys({
    name: Joi.string(),
    imageUrl: Joi.string(),
    discount: Joi.any(),
    imageFile: Joi.any(),
  }),
};

const updatePackage = {
  body: Joi.object().keys({
    name: Joi.string(),
    imageUrl: Joi.string(),
    discount: Joi.any(),
    imageFile: Joi.any(),
  }),
};

const getPackages = {
  query: Joi.object().keys({
    name: Joi.string(),
    page: Joi.any(),
    limit: Joi.any(),
  }),
};

const getPackageById = {
  query: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

const getPackage = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

const deletePackage = {
  params: Joi.object().keys({
    packageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPackage,
  getPackages,
  getPackage,
  deletePackage,
  getPackageById,
  updatePackage,
};
