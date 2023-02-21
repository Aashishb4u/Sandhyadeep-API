const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const bookingSchema = mongoose.Schema(
  {
    service: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Service',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    timeSlot: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Timeslot',
    },
    ratings: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
bookingSchema.plugin(toJSON);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
