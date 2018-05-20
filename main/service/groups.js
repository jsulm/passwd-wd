/**
 * Library to retrieve system group info from /etc/group.
 *
 * @author Jeff Sulm
 * @license 2018
 */

'use strict';

const HTTP_C = require('../../lib/common/http-constants.js');
const httpHelper = require('../../lib/server/http-helper.js');
const passwdHelper = require('../../lib/server/passwd-helper.js');

let groupFile = '';

/**
 * Return all groups fron the system.
 * @param {*} req
 * @param {*} rex
 * @param {*} callback
 * @example GET /groups
 */
exports.getAllGroups = function(req, res, callback) {
  let outputArray = [];
  let status = HTTP_C.OK;
  let retval = '';

  let returnLoadGroupData = function(err, groupDict) {
    if (err) {
      status = HTTP_C.INTERNAL_SERVER_ERROR;
      httpHelper.saveErrorDetailsInRequest(req, status, err);
      httpHelper.saveResultInRequest(req, status, retval);
      return callback();
    }

    for (let key in  groupDict) {
      outputArray.push(groupDict[key]);
    }

    if (outputArray.length <= 0) {
      status = HTTP_C.NO_CONTENT;
    } else {
      retval = JSON.stringify(outputArray);
    }

    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  };

  loadGroupData(returnLoadGroupData);
};

/**
 * getGroupsQuery returns the groups matching the querystring request.]
 * @param  {[type]}   req       [description]
 * @param  {[type]}   res       [description]
 * @param  {Function} callback  [description]
 * @example GET
/groups/query[?name=<nq>][&gid=<gq>][&member=<mq1>[&member=<mq2>][&.
..]]
 */
exports.getGroupsQuery = function(req, res, callback) {
  let name = '';
  let gid = -1;
  let member = [];

  // Validate query params
  let allParamNamesValid = true;
  Object.keys(req.query).forEach(function(key) {
    console.log(key);
    if (key !== 'name' &&
        key !== 'gid' &&
        key !== 'member') {
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

  if (req.query.gid) {
    gid = parseInt(req.query.gid);
    if (isNaN(gid)) {
      httpHelper.saveErrorDetailsInRequest(req, HTTP_C.BAD_REQUEST, 'gid');
      httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
      return callback();
    }
  }

  if (req.query.member) {
    member = req.query.member;
  }

  // Process string query
  let outputArray = [];
  let status = HTTP_C.OK;
  let retval = '';

  let returnLoadGroupData = function(err, groupDict) {
    if (err) {
      status = HTTP_C.INTERNAL_SERVER_ERROR;
      httpHelper.saveErrorDetailsInRequest(req, status, err);
      httpHelper.saveResultInRequest(req, status, retval);
      return callback();
    }

    for (let key in groupDict) {
      if ((name === '' || name === groupDict[key].name) &&
          (gid === -1 || gid === groupDict[key].gid) &&
          (member.length <= 0 ||
            containsMembers(groupDict[key].member, member))) {
            outputArray.push(groupDict[key]);
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

  loadGroupData(returnLoadGroupData);
};

/**
 * Returns the group with the specified gid.
 * @param {*} req
 * @param {*} res
 * @param {*} callback
 * @example GET /groups/<gid>
 */
exports.getGroup = function(req, res, callback) {
  let status = HTTP_C.OK;
  let retval = '';

  let gid = req.locals['gid'] === undefined ? -1 : req.locals['gid'] * 1;

  let returnLoadGroupData = function(err, groupDict) {
    if (err) {
      status = HTTP_C.INTERNAL_SERVER_ERROR;
      httpHelper.saveErrorDetailsInRequest(req, status, err);
    } else if (groupDict[gid] === null || groupDict[gid] === undefined) {
      status = HTTP_C.NOT_FOUND;
    } else {
      status = HTTP_C.OK;
      retval = JSON.stringify(groupDict[gid]);
    }

    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  };

  if (gid >= 0) {
    loadGroupData(returnLoadGroupData);
  } else {
    status = HTTP_C.BAD_REQUEST;
    httpHelper.saveResultInRequest(req, status, retval);
    return callback();
  }
};

exports.setGroupFile = function(filePath) {
  groupFile = filePath;
};

function loadGroupData(callback) {
  let returnReadGroupData = function(err, data) {
    callback(err, data);
  };

  passwdHelper.readGroupData(groupFile, returnReadGroupData);
}

/**
 * Returns true when all items in the second array are in the first array.
 * @param {*} firstArray
 * @param {*} secondArray
 */
function containsMembers(firstArray, secondArray) {
  for (let i = 0; i < secondArray.length; ++i) {
    if (!firstArray.includes(secondArray[i])) {
      return false;
    }
  }

  return true;
};