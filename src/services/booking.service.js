const httpStatus = require('http-status');
const { Booking } = require('../models');
const { Payment } = require('../models');
const { paymentService } = require('../services');
const ApiError = require('../utils/ApiError');

/**
 * Create a subServiceType
 * @returns {Promise<EnforceDocument<unknown, {}>[]>}
 * @param BookingBody
 */
const createBooking = async (BookingBody) => {
  return Booking.create(BookingBody);
};

/**
 * Get subServiceType by id
 * @param {ObjectId} id
 * @returns {Promise<Booking>}
 */
const getBookingById = async (id) => {
  return Booking.findById(id);
};
//
// const getAllBookings = async () => {
//   return Booking.find().populate('services.serviceId').populate('paymentId').sort({ $natural: -1 });
// };

const getAllBookings = async (filter) => {
  const caseInsensitiveFilter = filter ? { bookingOrderId: { $regex: new RegExp(filter.bookingOrderId, 'i') } } : {};

  return Booking.find(caseInsensitiveFilter)
    .populate({
      path: 'services.serviceId',
      populate: {
        path: 'services.serviceData',
      },
    })
    .populate('packages.packageId')
    .populate('paymentId')
    .sort({ $natural: -1 });
};


const getAllUserBookings = async (filteredUserId) => {
  return Booking.find({
    paymentId: {
      $in: await Payment.find({
        userId: filteredUserId,
      }).distinct('_id'),
    },
  })
    .populate({
      path: 'services.serviceId',
      populate: {
        path: 'services.serviceData',
      },
    })
    .populate('packages.packageId')
    .populate('paymentId').sort({ bookingDate: -1 }); // Sorting by bookingDate in descending order
};

/**
 * Update subServiceType by id
 * @param bookingId
 * @param {Object} updateBody
 * @returns {Promise<Booking>}
 */
const updateBookingById = async (bookingId, updateBody) => {
  const bookingType = await getBookingById(bookingId);
  if (!bookingType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  Object.assign(bookingType, updateBody);
  await bookingType.save();
  return bookingType;
};

const cancelBookingById = async (id, booking) => {
  let paymentStatus = null;
  let updatedBooking = await updateBookingById(id, booking);
  if(updatedBooking) {
    const paymentId = updatedBooking.paymentId;
    const payment = await paymentService.getPaymentById(paymentId);
    const data = {
      paymentStatus: (payment.paymentMethod === 'online') ? 'refund_initiated' : 'cancelled'
    }
    paymentStatus = await paymentService.updatePayment(paymentId, data)
  }
  return paymentStatus;
};

const completeBookingById = async (id, booking) => {
  let paymentStatus = null;
  let updatedBooking = await updateBookingById(id, booking);
  if(updatedBooking) {
    const paymentId = updatedBooking.paymentId;
    const payment = await paymentService.getPaymentById(paymentId);
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
    }
    const data = { paymentStatus: 'paid' }
    paymentStatus = await paymentService.updatePayment(paymentId, data)
  }
  return paymentStatus;
};

/**
 * Delete subServiceType by id
 * @param {ObjectId} subServiceTypeId
 * @returns {Promise<Booking>}
 */
const deleteBookingById = async (subServiceTypeId) => {
  const subServiceType = await getBookingById(subServiceTypeId);
  if (!subServiceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  await subServiceType.remove();
  return subServiceType;
};

module.exports = {
  createBooking,
  getBookingById,
  updateBookingById,
  deleteBookingById,
  getAllBookings,
  getAllUserBookings,
  cancelBookingById,
  completeBookingById
};
