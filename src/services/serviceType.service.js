const httpStatus = require('http-status');
const {ServiceType} = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a serviceType
 * @param {Object} serviceTypeBody
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 */
const createServiceType = async (serviceTypeBody) => {
  return ServiceType.create(serviceTypeBody);
};

/**
 * Get serviceType by id
 * @param {ObjectId} id
 * @returns {Promise<ServiceType>}
 */
const getServiceTypeById = async (id) => {
  return ServiceType.findById(id);
};

const getAllServiceTypes = async () => {
  return ServiceType.find().sort({ $natural: -1 });
};

const getMaxSequenceValue = async () => {
  return ServiceType.find().sort({ sequence: -1 }).limit(1);
};
/**
 * Get serviceType by email
 * @param {string} email
 * @returns {Promise<ServiceType>}
 */

/**
 * Update serviceType by id
 * @param {ObjectId} serviceTypeId
 * @param {Object} updateBody
 * @returns {Promise<ServiceType>}
 */
const updateServiceTypeById = async (serviceTypeId, updateBody) => {
  const serviceType = await getServiceTypeById(serviceTypeId);
  if (!serviceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ServiceType not found');
  }
  Object.assign(serviceType, updateBody);
  await serviceType.save();
  return serviceType;
};

/**
 * Delete serviceType by id
 * @param {ObjectId} serviceTypeId
 * @returns {Promise<ServiceType>}
 */
const deleteServiceTypeById = async (serviceTypeId) => {
  const serviceType = await getServiceTypeById(serviceTypeId);
  if (!serviceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ServiceType not found');
  }
  await serviceType.remove();
  return serviceType;
};

module.exports = {
  createServiceType,
  getServiceTypeById,
  updateServiceTypeById,
  deleteServiceTypeById,
  getAllServiceTypes,
  getMaxSequenceValue,
};
