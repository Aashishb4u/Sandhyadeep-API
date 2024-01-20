const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const pushNotificationValidation = require('../../validations/pushNotification.validation');
const pushNotificationController = require('../../controllers/pushNotification.controller');
const router = express.Router();


// Send Notification
router
  .route('/send')
  .post(auth('manageUsers'),
    validate(pushNotificationValidation.sendNotification),
    pushNotificationController.sendNotification)

// Save Subscription
router
  .route('/save')
  .post(validate(pushNotificationValidation.saveSubscription),
    pushNotificationController.saveSubscription)

module.exports = router;
