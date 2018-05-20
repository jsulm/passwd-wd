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

let parsePasswdFileAsJSON = function(data) {
  if (typeof data !== 'string') throw new Error('Not a string');

  return data
      .split('\n')
      .map(toUser)
      .filter(Boolean)
      .reduce(toDictionary, {});
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

let toDictionary = function(map, obj) {
  map[obj.uid] = obj;

  return map;
};
