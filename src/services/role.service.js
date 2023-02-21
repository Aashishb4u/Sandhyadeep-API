const httpStatus = require('http-status');
const { Role } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createRole = async (userBody) => {
  return Role.create(userBody);
};

const getAllRoles = async () => {
  return Role.find({});
};

const getRoleByName = async (rollName) => {
  return Role.findOne({ name: rollName });
};

const getRoleById = async (id) => {
  return Role.findOne({ _id: id });
};

const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  await role.remove();
  return role;
};
module.exports = {
  createRole,
  getAllRoles,
  getRoleByName,
  getRoleById,
  deleteRoleById,
};
