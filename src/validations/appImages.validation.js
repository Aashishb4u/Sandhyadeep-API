const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAppImage = {
  body: Joi.object().keys({
    name: Joi.string(),
  }),
};

const getAllAppImages = {
  query: Joi.object().keys({
    name: Joi.string(),
    assetLocation: Joi.string()
  }),
};

const getAppImages = {
  query: Joi.object().keys({
    name: Joi.string(),
    assetLocation: Joi.string(),
    page: Joi.any(),
    limit: Joi.any(),
  }),
};

const getAppImage = {
  params: Joi.object().keys({
    appImageId: Joi.string().custom(objectId),
  }),
};

const deleteAppImage = {
  params: Joi.object().keys({
    appImageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAppImage,
  getAppImages,
  getAppImage,
  deleteAppImage,
  getAllAppImages
};
