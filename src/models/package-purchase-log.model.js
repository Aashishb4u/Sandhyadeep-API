const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const packagePurchasedSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
    package: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Package',
    },
    timeSlot: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'timeSlot',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
packagePurchasedSchema.plugin(toJSON);

const PackagePurchased = mongoose.model('PackagePurchased', packagePurchasedSchema);
module.exports = PackagePurchased;
