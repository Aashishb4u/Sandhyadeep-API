const httpStatus = require('http-status');
const { SubService } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a subServiceType
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 * @param SubServiceBody
 */
const createSubService = async (SubServiceBody) => {
  return SubService.create(SubServiceBody);
};

/**
 * Get subServiceType by id
 * @param {ObjectId} id
 * @returns {Promise<SubService>}
 */
const getSubServiceById = async (id) => {
  return SubService.findById(id);
};

const getAllSubServices = async () => {
  return SubService.find().populate('serviceType');
};

/**
 * Update subServiceType by id
 * @param subServiceId
 * @param {Object} updateBody
 * @returns {Promise<SubService>}
 */
const updateSubServiceById = async (subServiceId, updateBody) => {
  const subServiceType = await getSubServiceById(subServiceId);
  if (!subServiceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubService not found');
  }
  Object.assign(subServiceType, updateBody);
  await subServiceType.save();
  return subServiceType;
};

/**
 * Delete subServiceType by id
 * @param {ObjectId} subServiceTypeId
 * @returns {Promise<SubService>}
 */
const deleteSubServiceById = async (subServiceTypeId) => {
  const subServiceType = await getSubServiceById(subServiceTypeId);
  if (!subServiceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubService not found');
  }
  await subServiceType.remove();
  return subServiceType;
};

module.exports = {
  createSubService,
  getSubServiceById,
  updateSubServiceById,
  deleteSubServiceById,
  getAllSubServices,
};
