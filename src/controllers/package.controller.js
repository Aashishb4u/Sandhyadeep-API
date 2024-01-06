const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { packageService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { picUpload } = require('../utils/fileUpload');
const pick = require('../utils/pick');

const createPackage = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const requestData = req.body;
      const reqData = {
        name: requestData.name,
        discount: requestData.discount == 'null' ? 0 : requestData.discount,
        description: requestData.description,
        services: JSON.parse(requestData.services),
        imageUrl: req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png',
      };
      packageService.createPackage(reqData).then((servicePackageResponse) => {
        handleSuccess(httpStatus.CREATED, { servicePackageResponse }, 'Image Created Successfully.', req, res);
      });
    }
  });
});

const getPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'assetLocation']);
  const options = {
    sortBy: '$natural:desc', // Specify your sorting criteria
    page: req.query.page || 1, // Page number
    limit: req.query.limit || 5, // Number of documents per page
    populate: 'services', // Fields to populate - Add more fields (,) separated
    // example - populate: 'services, products, x, y, z',
  };
  const result = await packageService.getPackages(filter, options);
  res.send(result);
});

const getAllPackages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'assetLocation']);
  const result = await packageService.getAllPackages(filter);
  res.send(result);
});

const getPackageById = catchAsync(async (req, res) => {
  const servicePackage = await packageService.getPackageById(req.params.packageId);
  if (!servicePackage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  res.send(servicePackage);
});

const updatePackage = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const requestData = req.body;
      const reqData = {
        name: requestData.name,
        discount: requestData.discount == 'null' ? 0 : requestData.discount,
        description: requestData.description,
        services: JSON.parse(requestData.services),
      };
      if (req.file && req.file.filename) {
        reqData.imageUrl = `public/${req.file.filename}`;
      }
      packageService.updatePackageById(req.params.packageId, reqData).then((response) => {
        handleSuccess(httpStatus.CREATED, { response }, 'Image Created Successfully.', req, res);
      });
    }
  });
});

const deletePackage = catchAsync(async (req, res) => {
  await packageService.deletePackageById(req.params.packageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPackage,
  getPackages,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
