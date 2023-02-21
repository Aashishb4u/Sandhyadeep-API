const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const packageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
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

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;
