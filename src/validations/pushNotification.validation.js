const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createNotification = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
  })
}

const saveSubscription = {
  body: Joi.object().keys({
   subscription: Joi.object().keys(
     {
       endpoint: Joi.string().required(),
       expirationTime: Joi.any(),
       keys: Joi.object().keys({
         auth: Joi.string().required(),
         p256dh: Joi.string().required(),
       })
     }
   )
  })
}

const sendNotification = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    url: Joi.string(),
  })
}


module.exports = {
  createNotification,
  saveSubscription,
  sendNotification
};
