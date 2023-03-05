const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const serviceTypeSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    sequence: {
      type: Number,
    },
    imageUrl: {
      type: String,
    },
    type: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
serviceTypeSchema.plugin(toJSON);

const ServiceType = mongoose.model('ServiceType', serviceTypeSchema);
module.exports = ServiceType;
