const httpStatus = require('http-status');
const { Service } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a serviceType
 * @param {Object} serviceTypeBody
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 */
const createService = async (serviceTypeBody) => {
  return Service.create(serviceTypeBody);
};

/**
 * Get serviceType by id
 * @param {ObjectId} id
 * @returns {Promise<Service>}
 */
const getServiceById = async (id) => {
  return Service.findById(id).populate('subService');
};

const getServiceByServiceIds = async (serviceData) => {
  const serviceIds = serviceData.map((v) => v.id);
  return Service.find({ _id: { $in: serviceIds } }).populate('subService');
};

const getAllServices = async () => {
  return Service.find().populate('subService').populate('serviceType').sort({ $natural: -1 });
};

const getServices = async (filter, options) => {
  return Service.paginate(filter, options);
  // return Service.find().populate('subService').populate('serviceType').sort({ $natural: -1 });
};

/**
 * Update serviceType by id
 * @param {ObjectId} serviceTypeId
 * @param {Object} updateBody
 * @returns {Promise<Service>}
 */
const updateServiceById = async (serviceTypeId, updateBody) => {
  const serviceType = await getServiceById(serviceTypeId);
  if (!serviceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  if (updateBody.mobileNo && (await Service.isPhoneDuplicate(updateBody.mobileNo, serviceTypeId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Mobile Number already taken');
  }
  Object.assign(serviceType, updateBody);
  await serviceType.save();
  return serviceType;
};

/**
 * Delete serviceType by id
 * @returns {Promise<Service>}
 * @param serviceId
 */
const deleteServiceById = async (serviceId) => {
  const service = await getServiceById(serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  await service.remove();
  return service;
};

module.exports = {
  createService,
  getServiceById,
  updateServiceById,
  deleteServiceById,
  getAllServices,
  getServiceByServiceIds,
  getServices
};
