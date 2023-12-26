const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {toJSON, paginate} = require('./plugins');
const {roles} = require('../config/roles');
const schema = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    mobileNo: {
      type: String,
      required: true,
      unique: true,
      default: 0,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    roleId: { type: schema.Types.ObjectId, ref: 'Role' },
    dateOfBirth: { type: Date },
    otpCount: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    isWhatsAppAvailable: { type: Boolean, default: false },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({email, _id: {$ne: excludeUserId}});
  return !!user;
};

/**
 * Check if mobileNo is taken
 * @param mobileNo
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isPhoneDuplicate = async function (mobileNo, excludeUserId) {
  const user = await this.findOne({mobileNo, _id: {$ne: excludeUserId}});
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

//
// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
