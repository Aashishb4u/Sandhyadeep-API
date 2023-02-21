const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const serviceSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    duration: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    serviceType: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ServiceType',
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
serviceSchema.plugin(toJSON);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
