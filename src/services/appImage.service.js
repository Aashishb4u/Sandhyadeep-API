const httpStatus = require('http-status');
const { AppImage } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a serviceType
 * @param {Object} appImageBody
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 */
const createAppImage = async (appImageBody) => {
  return AppImage.create(appImageBody);
};

/**
 * Get serviceType by id
 * @param {ObjectId} id
 * @returns {Promise<Service>}
 */
const getAppImageById = async (id) => {
  return AppImage.findById(id);
};

const getAllAppImages = async (filter) => {
  return AppImage.find(filter).sort({ $natural: -1 });
};

const getAppImages = async (filter, page, limit) => {
  const skip = (page - 1) * limit;
  const totalCount = await AppImage.countDocuments(filter);
  const totalPages = Math.ceil(totalCount / limit);

  const images = await AppImage.find(filter)
      .sort({ $natural: -1 })
      .skip(skip)
      .limit(limit);

  return {
    images,
    page,
    totalPages,
    totalCount,
  };
};

/**
 * Update serviceType by id
 * @param {ObjectId} appImageId
 * @param {Object} updateBody
 * @returns {Promise<Service>}
 */
const updateAppImageById = async (appImageId, updateBody) => {
  const appImage = await getAppImageById(appImageId);
  if (!appImage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  Object.assign(appImage, updateBody);
  await appImage.save();
  return appImage;
};

/**
 * Delete serviceType by id
 * @returns {Promise<Service>}
 * @param appImageId
 */
const deleteAppImageById = async (appImageId) => {
  const appImage = await getAppImageById(appImageId);
  if (!appImage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  await appImage.remove();
  return appImage;
};

module.exports = {
  createAppImage,
  getAppImageById,
  updateAppImageById,
  deleteAppImageById,
  getAllAppImages,
  getAppImages
};
