/**
 * This is a web service allowing requests to the etc/passwd and etc/groups
 * files.
 *
 * @author Jeff Sulm
 * @license 2018
 */

/* jslint node: true */
'use strict';

const express = require('express');
const app = express();
const http = require('http');
// const bodyParser = require('body-parser');
let server = {};

const config = require('../lib/common/config.js');
const httpHelper = require('../lib/server/http-helper.js');
const logger = require('../lib/common/logger.js');

const HTTP_C = require('../lib/common/http-constants.js');

const services = {
  users: require('./service/users.js'),
  groups: require('./service/groups.js')
};

let start = function () {
  app.use(function(req, res, next) {
    req.locals = {};
    next();
  });
  let router = express.Router();

  router.param('uid', function(req, res, next) {
    let tokens = req.url.split('/');
    req.locals.uid = tokens[tokens.length - 1];

    if (isNaN(req.locals.uid) || req.locals.uid < 0) {
      httpHelper.saveErrorDetailsInRequest(req, HTTP_C.BAD_REQUEST);
      httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
      next(HTTP_C.BAD_REQUEST);
    } else {
      next();
    }
  });


  router.route('/v1/users/:uid(\\d+)')
  .get(services.users.getUser);

  router.route('/v1/users')
  .get(services.users.getAllUsers);

  router.route('/v1/users/query')
  .get(services.users.getUsersQuery);

  // router.route('/v1/groups')
  // .get(services.groups.getGroups);

  app.use('/', router);
  app.disable('x-powered-by');
  server = http.createServer(app);

  server.listen(config.MAIN_PORT, () =>
    console.log('info: Starting on port ' + config.MAIN_PORT + '...'));

  router.use(httpHelper.processResults);
  router.use(httpHelper.processErrorDetails);
  router.use(httpHelper.sendResults);

  // Exception handling
  app.use(logExceptionHandler);
  app.use(clientExceptionHandler);
  app.use(catchAllExceptionHandler);
};

console.log('info: ----------------------------------------------------------');
console.log('info: passwd-ws, Passwd Web Service');
console.log('info: ----------------------------------------------------------');
config.loadConfig(function configReturn(isConfigLoaded) {
  if (!isConfigLoaded) {
    logger.log('error', 'Could not load server configuration.');
    return;
  }

  services.users.setPasswdFile(config.passwdFile);

  start();
})

// Log the exception
let logExceptionHandler = function(err, req, res, next) {
  if (err.stack !== undefined) {
    logger.log('error', 'Exception Stack: ' + err.stack);
  }

  next(err);
};

// Specific responses sent to client on an exception.
let clientExceptionHandler = function(err, req, res, next) {
  if (req.xhr) {
    res.status(HTTP_C.INTERNAL_SERVER_ERROR.code).send(
        {error: HTTP_C.INTERNAL_SERVER_ERROR.text});
  } else {
    next(err);
  }
};

// A catch-all response to send to client if the exception is not already handled.
let catchAllExceptionHandler = function(err, req, res, next) {
  let error = HTTP_C.INTERNAL_SERVER_ERROR.code;
  if ( (req.readyToSend === undefined) ||
       (Object.keys(req.readyToSend).length === 0) ) {
    res.status(error)
        .send();
  } else {
    error = req.readyToSend.code;
    res.status(error)
        .send();
  }

  // Error logging
  let ip = (req.locals !== undefined && req.locals.ip != undefined) ?
      ' ' + req.locals.ip : '';
  let result = req.readyToSend.result !== undefined ?
      ' ' + req.readyToSend.result : '';
  logger.log('error', 'Sending ' + req.readyToSend.code +
                     result +
                     ip);

  next();
};