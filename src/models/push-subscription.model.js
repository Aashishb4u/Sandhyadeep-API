const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  endpoint: { type: String, required: true },
  keys: {
    auth: { type: String, required: true },
    p256dh: { type: String, required: true },
  },
  // other subscription-related fields...
});

const Subscription = mongoose.model('PushSubscription', subscriptionSchema);

module.exports = Subscription;
