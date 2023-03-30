const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bookingService } = require('../services');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  handleSuccess(httpStatus.CREATED, { booking }, 'Booking created successfully.', req, res);
});

const getBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings();
  res.send(result);
});

const getBookingById = catchAsync(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.bookingId);
  if (!booking) {
    handleError(httpStatus.NOT_FOUND, 'Booking not found', req, res);
    return;
  }
  res.send(booking);
});

const updateBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.updateBookingById(req.params.bookingId, req.body);
  handleSuccess(httpStatus.CREATED, { booking }, 'Booking updated successfully.', req, res);
});

const deleteBooking = catchAsync(async (req, res) => {
  await bookingService.deleteBookingById(req.params.bookingId);
  handleSuccess(httpStatus.NO_CONTENT, {}, 'Booking deleted successfully.', req, res);
});

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
