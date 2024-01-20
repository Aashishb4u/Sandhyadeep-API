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
  const { title, body, url } = req.body;
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

  Promise.all(subscriptions.map(sub => webpush.sendNotification(
    sub, JSON.stringify(notificationPayload) )))
    .then(() => res.status(200).json({message: 'Newsletter sent successfully.'}))
    .catch(err => {
      console.error("Error sending notification, reason: ", err);
      // res.sendStatus(500);
    });

  // Wait for all promises to be resolved

  // All notifications sent, invoke handleSuccess
  handleSuccess(httpStatus.CREATED, {}, 'Subscriptions Sent Successfully.', req, res);
});



module.exports = {
  sendNotification,
  saveSubscription
};
