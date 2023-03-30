const httpStatus = require('http-status');
const { Booking } = require('../models');
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

const getAllBookings = async () => {
  return Booking.find().populate('paymentId').populate('services').sort({ $natural: -1 });
};

/**
 * Update subServiceType by id
 * @param subServiceId
 * @param {Object} updateBody
 * @returns {Promise<Booking>}
 */
const updateBookingById = async (subServiceId, updateBody) => {
  const subServiceType = await getBookingById(subServiceId);
  if (!subServiceType) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }
  Object.assign(subServiceType, updateBody);
  await subServiceType.save();
  return subServiceType;
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
};
