const webpush = require('web-push');
const constants = require('../utils/constants');
const catchAsync = require("../utils/catchAsync");
const {pushNotificationService} = require('../services')
const { handleSuccess, handleError } = require('../utils/SuccessHandler');
const httpStatus = require('http-status');

const saveSubscription = catchAsync(async (req, res) => {
  const requestBody = req.body.subscription;
  pushNotificationService.saveSubscription(requestBody)
    .then((subscription) => {
      handleSuccess(httpStatus.CREATED, subscription, 'Subscription Saved Successfully.', req, res);
    });
});

const sendNotification = catchAsync(async (req, res) => {
  const {title, body, url} = req.body;
  const notificationPayload = {
    "notification": {
      "title": "Angular News",
      "body": "Newsletter Available!",
      "icon": "assets/main-page-logo-small-hat.png",
      "vibrate": [100, 50, 100],
      "data": {
        "dateOfArrival": Date.now(),
        "primaryKey": 1
      },
      "actions": [{
        "action": "explore",
        "title": "Go to the site"
      }]
    }
  };

  const subscriptions = await pushNotificationService.getSubscription();
  subscriptions.forEach(subscription => {
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
      .then(() => {
        console.log("Notification sent successfully");
      }).catch(err => {
        // Check for the specific error that indicates an invalid subscription
        if (err.statusCode === 410) {
          // Handle invalid subscription (e.g., remove it from the database)
          console.warn('Invalid subscription detected. Removing from the database.');
          pushNotificationService.deleteSubscription(subscription.endpoint);
        } else {
          console.error('Could not send push notification', err);
        }
      });
  });
  handleSuccess(httpStatus.CREATED, {}, 'Subscription Sent Successfully.', req, res);
});


module.exports = {
  sendNotification,
  saveSubscription
};
