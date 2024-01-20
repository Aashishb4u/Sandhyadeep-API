const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const path = require('path');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const webpush = require('web-push');
const constants = require('./utils/constants');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

webpush.setVapidDetails(
  `mailto:${constants.PUSH_NOTIFICATION_EMAIL}`,
  constants.PUSH_NOTIFICATION_PUBLIC_KEY,
  constants.PUSH_NOTIFICATION_PRIVATE_KEY
);

// giving access to public folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());
// gzip compression
app.use(compression());

// enable cors
// app.use(cors());
app.use(cors({ origin: true, credentials: true, optionsSuccessStatus: 200 }));
// app.options('*', cors());
app.options('/*', (_, res) => {
  res.sendStatus(200);
});
// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/api/v1/auth', authLimiter);
}

// v1 api routes
app.use('/api/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
