const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const subServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    serviceType: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'ServiceType',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
subServiceSchema.plugin(toJSON);

const SubService = mongoose.model('SubService', subServiceSchema);
module.exports = SubService;
