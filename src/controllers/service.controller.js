const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { picUpload } = require('../utils/fileUpload');

const createService = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      let brandsArray = [];
      let skinTypesArray = [];
      const requestData = req.body;
      if (requestData.brands && typeof requestData.brands === 'string') {
        brandsArray = requestData.brands.split(',');
      }
      if (requestData.skinTypes && typeof requestData.skinTypes === 'string') {
        skinTypesArray = requestData.skinTypes.split(',');
      }
      const reqData = {
        name: requestData.name,
        type: requestData.type,
        duration: requestData.duration,
        price: requestData.price,
        subService: requestData.subService,
        description: requestData.description,
        brands: brandsArray,
        skinTypes: skinTypesArray,
        imageUrl: `public/${req.file.filename}`,
      };
      serviceService.createService(reqData).then((serviceTypeResponse) => {
        handleSuccess(httpStatus.CREATED, { serviceTypeResponse }, 'Service Created Successfully.', req, res);
      });
    }
  });
});

const getServices = catchAsync(async (req, res) => {
  const result = await serviceService.getAllServices();
  res.send(result);
});

const getServiceById = catchAsync(async (req, res) => {
  const service = await serviceService.getServiceById(req.params.serviceId);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }
  res.send(service);
});

const updateService = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      let brandsArray = [];
      let skinTypesArray = [];
      const requestData = req.body;
      if (requestData.brands && typeof requestData.brands === 'string') {
        brandsArray = requestData.brands.split(',');
      }
      if (requestData.skinTypes && typeof requestData.skinTypes === 'string') {
        skinTypesArray = requestData.skinTypes.split(',');
      }
      const reqData = {
        name: requestData.name,
        type: requestData.type,
        duration: requestData.duration,
        price: requestData.price,
        subService: requestData.subService,
        description: requestData.description,
        brands: brandsArray,
        skinTypes: skinTypesArray,
      };
      if (req.file && req.file.filename) {
        reqData.imageUrl = `public/${req.file.filename}`;
      }
      serviceService.updateServiceById(req.params.serviceId, reqData).then((serviceTypeResponse) => {
        handleSuccess(httpStatus.CREATED, { serviceTypeResponse }, 'Service Created Successfully.', req, res);
      });
    }
  });
});

const deleteService = catchAsync(async (req, res) => {
  await serviceService.deleteServiceById(req.params.serviceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
