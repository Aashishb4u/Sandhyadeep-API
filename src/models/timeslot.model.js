const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const timeSlotSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    bookingDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
timeSlotSchema.plugin(toJSON);

const Role = mongoose.model('Role', timeSlotSchema);
module.exports = Role;
