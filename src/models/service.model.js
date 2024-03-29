const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
    subService: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'SubService',
    },
    serviceType: {
      default: null,
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ServiceType',
    },
    type: {
      type: String,
    },
    description: {
      type: String,
    },
    skinTypes: [
      {
        type: [String],
      },
    ],
    brands: [
      {
        type: [String],
      },
    ],
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
serviceSchema.plugin(toJSON);
serviceSchema.plugin(paginate);

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;
