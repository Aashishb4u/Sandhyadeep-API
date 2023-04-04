const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bookingService, couponService, serviceService } = require('../services');
const {handleSuccess, handleError} = require('../utils/SuccessHandler');

const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  handleSuccess(httpStatus.CREATED, { booking }, 'Booking created successfully.', req, res);
});

// Modifies the Booking Data
const modifyBookingData = (bookingsData) => {
  return bookingsData.map((booking) => {
    return {
      ...booking.toObject(),
      paymentData: booking.paymentId, // <-- replace paymentId with paymentData
      paymentId: booking.paymentId.id,
      services: booking.services.map((service) => {
        const { serviceId, ...serviceData } = service.toObject();
        return {
          ...serviceData,
          serviceData: serviceId,
        };
      }),
      packages: booking.packages.map((servicePackage) => {
        const { packageId, ...packageData } = servicePackage.toObject();
        return {
          ...packageData,
          packageData: packageId,
        };
      }),
    };
  });
};

const getBookings = catchAsync(async (req, res) => {
  const bookingsData = await bookingService.getAllBookings();
  let filteredBookings = [];
  if (bookingsData && bookingsData.length) {
    filteredBookings = modifyBookingData(bookingsData);
  }
  res.send(filteredBookings);
});

const getUserRelatedBookings = catchAsync(async (req, res) => {
  const {userId} = req.params;
  const bookingsData = await bookingService.getAllUserBookings(userId);
  let filteredBookings = [];
  if (bookingsData && bookingsData.length) {
    filteredBookings = modifyBookingData(bookingsData);
  }
  res.send(filteredBookings);
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
  handleSuccess(httpStatus.CREATED, {booking}, 'Booking updated successfully.', req, res);
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
  getUserRelatedBookings,
};
