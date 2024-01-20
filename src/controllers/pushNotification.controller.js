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
  const vapidKeys = webpush.generateVAPIDKeys();
  const payload = {
    notification: {
      title: title,
      body: body,
    },
  };

  webpush.setVapidDetails(
    `mailto:${constants.PUSH_NOTIFICATION_EMAIL}`,
    constants.PUSH_NOTIFICATION_PUBLIC_KEY,
    constants.PUSH_NOTIFICATION_PRIVATE_KEY
  );

  const subscriptions = await pushNotificationService.getSubscription();

  // Map each sendNotification call to a promise
  const notificationPromises = subscriptions.map(subscription => {
    return webpush
      .sendNotification(subscription, JSON.stringify(payload))
      .then(() => {
        console.log('Notification sent successfully');
      })
      .catch(err => {
        if (err.statusCode === 410) {
          console.warn('Invalid subscription detected. Removing from the database.');
          pushNotificationService.deleteSubscription(subscription.endpoint);
        } else {
          console.error('Could not send push notification', err);
        }
      });
  });

  // Wait for all promises to be resolved
  await Promise.all(notificationPromises);

  // All notifications sent, invoke handleSuccess
  handleSuccess(httpStatus.CREATED, {}, 'Subscriptions Sent Successfully.', req, res);
});



module.exports = {
  sendNotification,
  saveSubscription
};
