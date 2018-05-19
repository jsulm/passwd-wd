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

let passwdFile = '';

exports.getAllUsers = function(req, rex, callback) {
  let outputArray = [];

  let userDict = loadUserData();

  for (let key in  userDict) {
    outputArray.push(userDict[key]);
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

/**
 * getUsersQuery Returns the users matching the querystring request.]
 * @param  {[type]}   req       [description]
 * @param  {[type]}   res       [description]
 * @param  {Function} callback  [description]
 * @example GET
/users/query[?name=<nq>][&uid=<uq>][&gid=<gq>][&comment=<cq>][&home=<
hq>][&shell=<sq>]
 */
exports.getUsersQuery = function(req, res, callback) {
  let name = '';
  let uid = -1;
  let gid = -1;
  let comment = '';
  let home = '';
  let shell = '';

  for (let property in req.query) {
    if (req.query.hasOwnProperty(property)) {
      // Validate all params.
      console.log(property);

    }
  }

  let keys = Object.keys(req.query);
  console.log(keys);

  // Validate query params
  let allParamNamesValid = true;
  Object.keys(req.query).forEach(function(key) {
    console.log(key);
    if (key !== 'name' &&
        key !== 'uid' &&
        key !== 'gid' &&
        key !== 'comment' &&
        key !== 'shell') {
          allParamNamesValid = false;
        }
  });

  if (!allParamNamesValid) {
    httpHelper.saveErrorDetailsInRequest(req, HTTP_C.BAD_REQUEST, 'Invalid parameter');
    httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
    return callback();
  }

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

  let userDict = loadUserData();

  for (let key in userDict) {
    if ((name === '' || name === userDict[key].name) &&
        (uid === -1 || uid === userDict[key].uid) &&
        (gid === -1 || gid === userDict[key].gid) &&
        (comment === '' || comment === userDict[key].comment) &&
        (home === '' || home === userDict[key].home) &&
        (shell === '' || shell == userDict[key].shell)) {
          outputArray.push(userDict[key]);
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
  let status = HTTP_C.OK;
  let retval = '';

  let uid = req.locals['uid'] === undefined ? -1 : req.locals['uid'] * 1;

  if (uid >= 0) {
    let userDict = loadUserData();
    if (userDict[uid] === null || userDict[uid] === undefined) {
      status = HTTP_C.NOT_FOUND;
    } else {
      status = HTTP_C.OK;
      let userDict = loadUserData();
      retval = JSON.stringify(userDict[uid]);
    }
  } else {
    status = HTTP_C.BAD_REQUEST;
  }

  httpHelper.saveResultInRequest(req, status, retval);
  return callback();
};

exports.setPasswdFile = function(filePath) {
  passwdFile = filePath;
};

function loadUserData() {
  // uid to user details dictionary mapping
  let userDict = {};
  userDict[0] = {"name": "root", "uid": 0, "gid": 0, "comment": "root", "home": "/root",
  "shell": "/bin/bash"};
  userDict[1001] = {"name": "dwoodlins", "uid": 1001, "gid": 1001, "comment": "", "home":
  "/home/dwoodlins", "shell": "/bin/false"};

  return userDict;
}
