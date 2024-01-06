const httpStatus = require('http-status');
const { Package } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a serviceType
 * @param {Object} servicePackageBody
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 */
const createPackage = async (servicePackageBody) => {
  return Package.create(servicePackageBody);
};

/**
 * Get serviceType by id
 * @param {ObjectId} id
 * @returns {Promise<Service>}
 */
const getPackageById = async (id) => {
  return Package.findById(id);
};

const getAllPackages = async (filter) => {
  return Package.find(filter).populate('services').sort({ $natural: -1 });
};

const getPackages = async (filter, options) => {
  return Package.paginate(filter, options);
};
/**
 * Update serviceType by id
 * @param {ObjectId} servicePackageId
 * @param {Object} updateBody
 * @returns {Promise<Service>}
 */
const updatePackageById = async (servicePackageId, updateBody) => {
  const servicePackage = await getPackageById(servicePackageId);
  if (!servicePackage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  Object.assign(servicePackage, updateBody);
  await servicePackage.save();
  return servicePackage;
};

/**
 * Delete serviceType by id
 * @returns {Promise<Service>}
 * @param servicePackageId
 */
const deletePackageById = async (servicePackageId) => {
  const servicePackage = await getPackageById(servicePackageId);
  if (!servicePackage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  await servicePackage.remove();
  return servicePackage;
};

module.exports = {
  createPackage,
  getPackageById,
  updatePackageById,
  deletePackageById,
  getAllPackages,
  getPackages
};
