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
 * @example GET
/users/query[?name=<nq>][&uid=<uq>][&gid=<gq>][&comment=<cq>][&home=<
hq>][&shell=<sq>]
 */
exports.getUsers = function(req, res, callback) {
  let name = '';
  let uid = -1;
  let gid = -1;
  let comment = '';
  let home = '';
  let shell = '';

  // Get string query params
  if (req.query.name) {
    name = req.query.name;
  }

  if (req.query.uid) {
    uid = parseInt(req.query.uid);
    if (isNaN(uid) || uid < 0) {
      httpHelper.saveErrorDetailsInRequest(req, HTTP_C.BAD_REQUEST, 'uid');
      httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
      return callback();
    }
  }

  if (req.query.gid) {
    gid = parseInt(req.query.gid);
    if (isNaN(gid) || gid < 0) {
      httpHelper.saveErrorDetailsInRequest(req, HTTP_C.BAD_REQUEST, 'gid');
      httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
      return callback();
    }
  }

  if (req.query.comment) {
    comment = req.query.comment;
  }

  if (req.query.home) {
    home = req.query.home;
  }

  if (req.query.shell) {
    shell = req.query.shell;
  }

  // Process string query
  let outputArray = [];

  for (let i = 0; i < userArray.length; ++i) {
    if ((name === '' || name === userArray[i].name) &&
        (uid === -1 || uid === userArray[i].uid) &&
        (gid === -1 || gid === userArray[i].gid) &&
        (comment === '' || comment === userArray[i].comment) &&
        (home === '' || home === userArray[i].home) &&
        (shell === '' || shell == userArray[i].shell)) {
          outputArray.push(userArray[i]);
    }
  }

  let status = HTTP_C.OK;
  let retval = '';
  if (outputArray.length <= 0) {
    status = HTTP_C.NO_CONTENT;
  } else {
    retval = JSON.stringify(outputArray);
  }

  httpHelper.saveResultInRequest(req, status, retval);
  return callback();
};

exports.getUser = function(req, res, callback) {
  let uid = req.locals['uid'] === undefined ? -1 : req.locals['uid'] * 1;

  if (uid >= 0) {
    // TODO: process request
  }

  let status = HTTP_C.OK;
  let retval = '';
  let outputArray = [];

  if (outputArray.length <= 0) {
    status = HTTP_C.NO_CONTENT;
  } else {
    retval = JSON.stringify(outputArray);
  }

  httpHelper.saveResultInRequest(req, status, retval);

  return callback();
};