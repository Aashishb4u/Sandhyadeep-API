const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { appImageService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { picUpload } = require('../utils/fileUpload');
const pick = require('../utils/pick');

const createAppImage = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const requestData = req.body;
      const reqData = {
        name: requestData.name,
        assetLocation: requestData.assetLocation,
        imageUrl: req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png',
      };
      appImageService.createAppImage(reqData).then((appImageResponse) => {
        handleSuccess(httpStatus.CREATED, { appImageResponse }, 'Image Created Successfully.', req, res);
      });
    }
  });
});

const getAppImages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'assetLocation']);
  const result = await appImageService.getAllAppImages(filter);
  res.send(result);
});

const getAppImageById = catchAsync(async (req, res) => {
  const appImage = await appImageService.getAppImageById(req.params.appImageId);
  if (!appImage) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Image not found');
  }
  res.send(appImage);
});

const updateAppImage = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const requestData = req.body;
      const reqData = {
        name: requestData.name,
        assetLocation: requestData.assetLocation,
        imageUrl:
          req.file && req.file.filename ? `public/${req.file.filename}` : 'public/no-image.png',
      };
      appImageService.updateServiceById(req.params.appImageId, reqData).then((response) => {
        handleSuccess(httpStatus.CREATED, { response }, 'Image Created Successfully.', req, res);
      });
    }
  });
});

const deleteAppImage = catchAsync(async (req, res) => {
  await appImageService.deleteAppImageById(req.params.appImageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAppImage,
  getAppImages,
  getAppImageById,
  updateAppImage,
  deleteAppImage,
};
