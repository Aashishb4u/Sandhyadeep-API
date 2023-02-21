const mongoose = require('mongoose');
const {toJSON} = require('./plugins');

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roleSchema.plugin(toJSON);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
