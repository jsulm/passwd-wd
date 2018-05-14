/**
 * Library to retrieve info from etc/passwd users.
 *
 * @author Jeff Sulm
 * @license 2018
 */

'use strict';

// const async = require('async');
const HTTP_C = require('../../lib/common/http-constants.js');
const httpHelper = require('../../lib/server/http-helper.js');

const userArray =
[
  {"name": "root", "uid": 0, "gid": 0, "comment": "root", "home": "/root",
  "shell": "/bin/bash"},
  {"name": "dwoodlins", "uid": 1001, "gid": 1001, "comment": "", "home":
  "/home/dwoodlins", "shell": "/bin/false"}
];

/**
 * getUsers Returns the users matching the querystring request.]
 * @param  {[type]}   req       [description]
 * @param  {[type]}   res       [description]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
exports.getUsers = function(req, res, callback) {
  let status = HTTP_C.OK;
  let retval = JSON.stringify(userArray);

  httpHelper.saveResultInRequest(req, status, retval);
  return callback();
};
