const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    },
    services: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Service',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
packageSchema.plugin(toJSON);
packageSchema.plugin(paginate);

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
