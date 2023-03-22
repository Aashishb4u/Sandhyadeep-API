const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const appImageSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    assetLocation: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
appImageSchema.plugin(toJSON);

const AppImage = mongoose.model('AppImage', appImageSchema);
module.exports = AppImage;
