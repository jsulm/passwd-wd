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
      httpHelper.saveResultInRequest(HTTP_C.BAD_REQUEST, '');
      next(HTTP_C.BAD_REQUEST);
    } else {
      next();
    }
  });


  router.route('/v1/users/:uid')
  .get(services.users.getUser);

  router.route('/v1/users')
  .get(services.users.getUsers);

  router.route('/v1/users/query')
  .get(services.users.getUsers);

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
};

console.log('info: ----------------------------------------------------------');
console.log('info: passwd-ws, Passwd Web Service');
console.log('info: ----------------------------------------------------------');
config.loadConfig(function configReturn(isConfigLoaded) {
  if (!isConfigLoaded) {
    logger.log('error', 'Could not load server configuration.');
    return;
  }

  start();
})
