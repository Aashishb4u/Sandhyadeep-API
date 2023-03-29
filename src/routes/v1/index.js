const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const serviceTypeRoute = require('./serviceType.route');
const subServiceRoute = require('./serviceSubType.route');
const serviceRoute = require('./service.route');
const couponsRoute = require('./coupon.route');
const rolesRoute = require('./role.route');
const docsRoute = require('./docs.route');
const appImageRoute = require('./appImages.route');
const packageRoute = require('./package.route');
const paymentRoute = require('./payment.route');
const bookingRoute = require('./booking.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/services',
    route: serviceRoute,
  },
  {
    path: '/serviceTypes',
    route: serviceTypeRoute,
  },
  {
    path: '/subServices',
    route: subServiceRoute,
  },
  {
    path: '/coupons',
    route: couponsRoute,
  },
  {
    path: '/roles',
    route: rolesRoute,
  },
  {
    path: '/appImages',
    route: appImageRoute,
  },
  {
    path: '/packages',
    route: packageRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/bookings',
    route: bookingRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
