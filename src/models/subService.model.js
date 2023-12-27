const mongoose = require('mongoose');
const {toJSON, paginate} = require('./plugins');

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
subServiceSchema.plugin(paginate);

const SubService = mongoose.model('SubService', subServiceSchema);
module.exports = SubService;
