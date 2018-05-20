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
const passwdHelper = require('../../lib/server/passwd-helper.js');

let passwdFile = '';

exports.getAllUsers = function(req, rex, callback) {
  let outputArray = [];
  let status = HTTP_C.OK;
  let retval = '';

  let returnLoadUserData = function(err, userDict) {
    if (err) {
      status = HTTP_C.INTERNAL_SERVER_ERROR;
      httpHelper.saveErrorDetailsInRequest(req, status, err);
      httpHelper.saveResultInRequest(req, status, retval);
      return callback();
    }

    for (let key in  userDict) {
      outputArray.push(userDict[key]);
    }

    if (outputArray.length <= 0) {
      status = HTTP_C.NO_CONTENT;
    } else {
      retval = JSON.stringify(outputArray);
    }

    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  };

  loadUserData(returnLoadUserData);
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
    if (isNaN(uid)) {
      httpHelper.saveErrorDetailsInRequest(req, HTTP_C.BAD_REQUEST, 'uid');
      httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
      return callback();
    }
  }

  if (req.query.gid) {
    gid = parseInt(req.query.gid);
    if (isNaN(gid)) {
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
  let status = HTTP_C.OK;
  let retval = '';

  let returnLoadUserData = function(err, userDict) {
    if (err) {
      status = HTTP_C.INTERNAL_SERVER_ERROR;
      httpHelper.saveErrorDetailsInRequest(req, status, err);
      httpHelper.saveResultInRequest(req, status, retval);
      return callback();
    }

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

    if (outputArray.length <= 0) {
      status = HTTP_C.NO_CONTENT;
    } else {
      retval = JSON.stringify(outputArray);
    }

    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  };

  loadUserData(returnLoadUserData);
};

exports.getUser = function(req, res, callback) {
  let status = HTTP_C.OK;
  let retval = '';

  let uid = req.locals['uid'] === undefined ? -1 : req.locals['uid'] * 1;

  if (uid >= 0) {
    loadUserData(returnLoadUserData);
  } else {
    status = HTTP_C.BAD_REQUEST;
    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  }

  let returnLoadUserData = function(err, userDict) {
    if (err) {
      status = HTTP_C.INTERNAL_SERVER_ERROR;
      httpHelper.saveErrorDetailsInRequest(req, status, err);
    } else if (userDict[uid] === null || userDict[uid] === undefined) {
      status = HTTP_C.NOT_FOUND;
    } else {
      status = HTTP_C.OK;
      retval = JSON.stringify(userDict[uid]);
    }

    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  };
};

exports.setPasswdFile = function(filePath) {
  passwdFile = filePath;
};

function loadUserData(callback) {
  let returnReadUserData = function(err, data) {
    callback(err, data);
  };

  passwdHelper.readUserData(passwdFile, returnReadUserData);
}
