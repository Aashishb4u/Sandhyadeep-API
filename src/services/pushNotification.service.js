const { Subscription } = require('../models');


const saveSubscription = async(reqBody) => {
  return Subscription.create(reqBody);
}

const getSubscription = async () => {
  return Subscription.find();
}


const deleteSubscription = async (endpoint) => {
  const subscription = Subscription.findOne({ endpoint });
  return subscription.remove();
}


module.exports = {
  saveSubscription,
  getSubscription,
  deleteSubscription
}
