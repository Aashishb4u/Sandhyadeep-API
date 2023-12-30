const httpStatus = require('http-status');
const moment = require('moment');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  const { email } = userBody;
  const emailTaken = await User.isEmailTaken(email);

  if (emailTaken) {
    throw new ApiError(httpStatus.CONFLICT, 'Email Already Taken');
  }

  // Use await when creating the user
  const user = await User.create(userBody);

  // Use await when populating the roleId
  return await getUserById(user.id);
};

const getUserByNumber = async (userBody) => {
  const condition = {
    mobileNo: userBody.mobileNo,
  };
  return User.findOne(condition)
    .populate('roleId')
    .then((userData) => {
      return Promise.resolve(userData);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  return await User.paginate(filter, options);
};

const getAllUsers = async () => {
  const users = await User.find().populate('roleId').sort({ $natural: -1 });
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id).populate('roleId');
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email }).populate('roleId');
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  const isWhatsAppAvailable = false;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  updateBody.isWhatsAppAvailable = isWhatsAppAvailable || updateBody.isWhatsAppAvailable;
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};


module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  getUserByNumber,
  getAllUsers
};
