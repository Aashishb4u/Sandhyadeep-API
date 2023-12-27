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

const getAllSubServices = catchAsync(async (req, res) => {
  const result = await subServiceService.getAllSubServices();
  res.send(result);
});

const getSubServices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = {
    sortBy: '$natural:desc', // Specify your sorting criteria
    page: req.query.page || 1, // Page number
    limit: req.query.limit || 5, // Number of documents per page
    populate: 'serviceType', // Fields to populate - Add more fields (,) separated
    // example - populate: 'services, products, x, y, z',
  };
  const result = await subServiceService.getSubServices(filter, options);
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
  getAllSubServices
};
