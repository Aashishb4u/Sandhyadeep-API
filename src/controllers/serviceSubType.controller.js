const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subServiceService } = require('../services');
const { handleSuccess } = require('../utils/SuccessHandler');

const createSubService = catchAsync(async (req, res) => {
  const subService = await subServiceService.createSubService(req.body);
  handleSuccess(httpStatus.CREATED, { subService }, 'Sub Service created successfully.', req, res);

});

const getSubServices = catchAsync(async (req, res) => {
  const result = await subServiceService.getAllSubServices();
  res.send(result);
});

const getSubServiceById = catchAsync(async (req, res) => {
  const subService = await subServiceService.getSubServiceById(req.params.subServiceId);
  if (!subService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'SubService not found');
  }
  res.send(subService);
});

const updateSubService = catchAsync(async (req, res) => {
  const subService = await subServiceService.updateSubServiceById(req.params.subServiceId, req.body);
  handleSuccess(httpStatus.CREATED, { subService }, 'Sub Service updated successfully.', req, res);
});

const deleteSubService = catchAsync(async (req, res) => {
  await subServiceService.deleteSubServiceById(req.params.subServiceId);
  handleSuccess(httpStatus.NO_CONTENT, {}, 'Sub Service deleted successfully.', req, res);
});

module.exports = {
  createSubService,
  getSubServices,
  getSubServiceById,
  updateSubService,
  deleteSubService,
};
