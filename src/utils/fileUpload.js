const multer = require('multer');

const picStorage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'src/public');
  },
  filename(req, file, callback) {
    callback(null, file.originalname);
  },
});

const picUpload = multer({
  storage: picStorage,
  fileFilter(req, file, callback) {
    if (['jpg', 'png', 'jpeg'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
      console.log(file.originalname, 'file.originalname');
      return callback(new Error('Invalid File Extension'));
    }
    callback(null, true);
  },
}).single('file');

const parseMultipart = multer({}).array();

module.exports = {
  picUpload,
  parseMultipart,
};
