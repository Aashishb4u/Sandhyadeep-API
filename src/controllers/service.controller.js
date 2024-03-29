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
        serviceType: requestData.serviceType,
        description: requestData.description,
        brands: brandsArray,
        skinTypes: skinTypesArray,
      };
      reqData.imageUrl = req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png';
      if (requestData.subService && requestData.subService !== 'not_applicable') {
        reqData.subService = requestData.subService;
      }
      serviceService.createService(reqData).then((serviceTypeResponse) => {
        handleSuccess(httpStatus.CREATED, { serviceTypeResponse }, 'Service Created Successfully.', req, res);
      });
    }
  });
});

const getAllServices = catchAsync(async (req, res) => {
  const result = await serviceService.getAllServices();
  res.send(result);
});

const getServices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = {
    sortBy: '$natural:desc', // Specify your sorting criteria
    page: req.query.page || 1, // Page number
    limit: req.query.limit || 5, // Number of documents per page
    populate: 'subService,serviceType', // Fields to populate - Add more fields (,) separated
    // example - populate: 'services, products, x, y, z',
  };
  const result = await serviceService.getServices(filter, options);
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
      // const reqData = {
      //   name: requestData.name,
      //   type: requestData.type,
      //   duration: requestData.duration,
      //   price: requestData.price,
      //   serviceType: requestData.serviceType,
      //   description: requestData.description,
      //   brands: brandsArray,
      //   skinTypes: skinTypesArray,
      // };

      // Check if requestData contains specific properties before creating reqData
      const reqData = {};
      if (requestData.name) reqData.name = requestData.name;
      if (requestData.type) reqData.type = requestData.type;
      if (requestData.duration) reqData.duration = requestData.duration;
      if (requestData.price) reqData.price = requestData.price;
      if (requestData.serviceType) reqData.serviceType = requestData.serviceType;
      if (requestData.description) reqData.description = requestData.description;

      if (requestData.brands && typeof requestData.brands === 'string') {
        brandsArray = requestData.brands.split(',');
        reqData.brands = brandsArray;
      }

      if (requestData.skinTypes && typeof requestData.skinTypes === 'string') {
        skinTypesArray = requestData.skinTypes.split(',');
        reqData.skinTypes = skinTypesArray;
      }

      if (req.file && req.file.filename) {
        reqData.imageUrl = `public/${req.file.filename}`;
      }

      if (requestData.subService && requestData.subService !== 'not_applicable') {
        reqData.subService = requestData.subService;
      } else if (requestData.subService === 'not_applicable') {
        reqData.subService = null;
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
  getAllServices
};
