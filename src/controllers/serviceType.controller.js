const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { serviceTypeService } = require('../services');
const { picUpload, parseMultipart } = require('../utils/fileUpload');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');

const createServiceType = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      serviceTypeService.getMaxSequenceValue().then((maxSeqServiceType) => {
        const sequence = maxSeqServiceType && maxSeqServiceType.length === 0 ? 1 : +maxSeqServiceType[0].sequence + 1;
        const reqData = {
          name: req.body.name,
          sequence,
          imageUrl: `public/${req.file.filename}`,
          type: req.body.type,
        };
        serviceTypeService.createServiceType(reqData).then((serviceTypeResponse) => {
          handleSuccess(httpStatus.CREATED, { serviceTypeResponse }, 'ServiceType created successfully.', req, res);
        });
      });
    }
  });
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
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      const reqData = {
        name: req.body.name,
        type: req.body.type,
      };
      if (req.file && req.file.filename) {
        reqData.imageUrl = `public/${req.file.filename}`;
      }
      serviceTypeService.updateServiceTypeById(req.params.serviceTypeId, reqData).then((serviceTypeResponse) => {
        handleSuccess(httpStatus.CREATED, { serviceTypeResponse }, 'ServiceType updated successfully.', req, res);
      });
    }
  });
});

const deleteServiceType = catchAsync(async (req, res) => {
  await serviceTypeService.deleteServiceTypeById(req.params.serviceTypeId);
  handleSuccess(httpStatus.NO_CONTENT, {}, 'ServiceType deleted successfully.', req, res);
});

module.exports = {
  createServiceType,
  getServiceTypes,
  getServiceTypeById,
  updateServiceType,
  deleteServiceType,
};
