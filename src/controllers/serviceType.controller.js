const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceTypeService } = require('../services');

const createServiceType = catchAsync(async (req, res) => {
  const serviceType = await serviceTypeService.createServiceType(req.body);
  res.status(httpStatus.CREATED).send(serviceType);
});

const getServiceTypes = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await serviceTypeService.getAllServiceTypes();
  res.send(result);
});

const getServiceTypeById = catchAsync(async (req, res) => {
  const serviceType = await serviceTypeService.getServiceTypeById(req.params.serviceTypeId);
  if (!serviceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'ServiceType not found');
  }
  res.send(serviceType);
});

const updateServiceType = catchAsync(async (req, res) => {
  const serviceType = await serviceTypeService.updateServiceTypeById(req.params.serviceTypeId, req.body);
  res.send(serviceType);
});

const deleteServiceType = catchAsync(async (req, res) => {
  await serviceTypeService.deleteServiceTypeById(req.params.serviceTypeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createServiceType,
  getServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
};
