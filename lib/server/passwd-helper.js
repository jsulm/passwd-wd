/**
 * HTTP Constants
 *
 * @author Jeff Sulm
 * @license 2018
 */

'use strict';

const logger = require('../common/logger.js');
var fs = require('fs');

exports.readUserData = function(filePath, callback) {
  fs.exists(filePath, function fileExistReturn(exists) {
    if (exists) {
      fs.readFile(filePath, 'utf8', function readFileReturn(err, data) {
        if (err) return callback(err);

        let userDict = {};

        try {
          userDict = parsePasswdFileAsJSON(data);
        } catch (e) {
          logger.error('Could not parse the passwd file at ' +
              filePath +
              '. ' +
              e);
          return callback(e);
        }
        return callback(null, userDict);
      });
    } else {
      let error = 'User data file does not exist. ' +
          'This file is expected:' + filePath;
      logger.error(error);
      return callback(new Error(error));
    }
  });
};

exports.readGroupData = function(filePath, callback) {
  fs.exists(filePath, function fileExistReturn(exists) {
    if (exists) {
      fs.readFile(filePath, 'utf8', function readFileReturn(err, data) {
        if (err) return callback(err);

        let dict = {};

        try {
          dict = parseGroupFileAsJSON(data);
        } catch (e) {
          logger.error('Could not parse the group file at ' +
              filePath +
              '. ' +
              e);
          return callback(e);
        }
        return callback(null, dict);
      });
    } else {
      let error = 'Group data file does not exist. ' +
          'This file is expected:' + filePath;
      logger.error(error);
      return callback(new Error(error));
    }
  });
};

exports.getGroupsArrayForUserName = function(username, groupDict) {
  let outputArray = [];

  for (let row in groupDict) {
    if (groupDict[row].members.includes(username)) {
      outputArray.push(groupDict[row]);
    }
  }

  return outputArray;
};

let parsePasswdFileAsJSON = function(data) {
  if (typeof data !== 'string') throw new Error('Not a string');

  return data
      .split('\n')
      .map(toUser)
      .filter(Boolean)
      .reduce(toUserDictionary, {});
};

let parseGroupFileAsJSON = function(data) {
  if (typeof data !== 'string') throw new Error('Not a string');

  return data
      .split('\n')
      .map(toGroup)
      .filter(Boolean)
      .reduce(toGroupDictionary, {});
};

let toUser = function(line) {
  if (!line || line.length <= 0 || line.charAt(0) === '#') {
    return '';
  }

  let fields = line.split(':');

  if (fields.length != 7 ||
      isNaN(fields[2]) ||
      isNaN(fields[3])) {
    throw new Error('Invalid field format');
  }

  return {
    name: fields[0],
    uid: fields[2],
    gid: fields[3],
    comment: fields[4],
    home: fields[5],
    shell: fields[6]
  };
};

let toGroup = function(line) {
  if (!line || line.length <= 0 || line.charAt(0) === '#') {
    return '';
  }

  let fields = line.split(':');

  if (fields.length != 4 ||
      isNaN(fields[2])) {
    throw new Error('Invalid field format');
  }

  let member = fields[3].split(',');

  return {
    name: fields[0],
    gid: fields[2],
    members: member
  };
};

let toUserDictionary = function(map, obj) {
  map[obj.uid] = obj;

  return map;
};

let toGroupDictionary = function(map, obj) {
  map[obj.gid] = obj;

  return map;
};
