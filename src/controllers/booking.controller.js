const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { subServiceService } = require('../services');
const { handleSuccess } = require('../utils/SuccessHandler');

const createBooking = catchAsync(async (req, res) => {
  const subService = await subServiceService.createBooking(req.body);
  handleSuccess(httpStatus.CREATED, { subService }, 'Sub Service created successfully.', req, res);

});

const getBookings = catchAsync(async (req, res) => {
  const result = await subServiceService.getAllBookings();
  res.send(result);
});

const getBookingById = catchAsync(async (req, res) => {
  const subService = await subServiceService.getBookingById(req.params.subServiceId);
  if (!subService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  res.send(subService);
});

const updateBooking = catchAsync(async (req, res) => {
  const subService = await subServiceService.updateBookingById(req.params.subServiceId, req.body);
  handleSuccess(httpStatus.CREATED, { subService }, 'Sub Service updated successfully.', req, res);
});

const deleteBooking = catchAsync(async (req, res) => {
  await subServiceService.deleteBookingById(req.params.subServiceId);
  handleSuccess(httpStatus.NO_CONTENT, {}, 'Sub Service deleted successfully.', req, res);
});

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
