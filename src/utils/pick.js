/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      if (typeof object[key] === 'string') {
        // Convert the value to a regex pattern for case-insensitive substring matching
        // We updated this stuff
        obj[key] = { $regex: new RegExp(object[key], 'i') };
      } else {
        obj[key] = object[key];
      }
    }
    return obj;
  }, {});
};

module.exports = pick;
