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

const services = {
  users: require('./service/users.js'),
  groups: require('./service/groups.js')
};

let start = function () {
  let router = express.Router();
  router.route('/v1/users')
  .get(services.users.getUsers);

  // router.route('/v1/groups')
  // .get(services.groups.getGroups);

router.route('/v1/test')
.get(function(req, res) {
  res.send('test');
});

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
