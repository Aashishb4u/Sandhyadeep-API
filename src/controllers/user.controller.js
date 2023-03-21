const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const messages = require('../utils/constants');
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const { picUpload } = require('../utils/fileUpload');

const createUser = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      let requestData = req.body;
      requestData.isRegistered = true;
      requestData.imageUrl = req.file && req.file.filename ? `public/${req.file.filename}` : 'public/default-profile.png';
      userService.createUser(requestData).then((userResponse) => {
        handleSuccess(httpStatus.CREATED, { userResponse }, 'User Created Successfully.', req, res);
      });
    }
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.getAllUsers();
  res.send(result);
});

const getUserById = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  picUpload(req, res, (err, data) => {
    if (err) {
      handleError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Image is not uploaded', req, res, err);
    } else {
      let requestData = req.body;
      requestData.isRegistered = true;
      if (req.file && req.file.filename) {
        requestData.imageUrl = `public/${req.file.filename}`;
      }
      userService.updateUserById(req.params.userId, requestData).then(async () => {
        const userData = await userService.getUserById(req.params.userId);
        handleSuccess(httpStatus.CREATED, { userData }, 'User Updated Successfully.', req, res);
      });
    }
  });
});

const deleteUser = catchAsync(async (req, res) => {
  // await userService.deleteUserById(req.params.userId);
  const user = await userService.getUserById(req.params.userId);
  if (req.params.userId === user.id) {
    handleError(httpStatus.FORBIDDEN, 'Admin cannot delete their own account.', req, res, '');
    return;
  }
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
};
