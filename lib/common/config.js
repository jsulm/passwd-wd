/**
 * Reads user configuration settings from JSON files based on NODE_ENV variable.
 * Any user settings overwrite the default settings in config/default.json.
 *
 * The configuation is set for example to 'dev' with the following command:
 * export NODE_ENV=dev
 *
 * @author Jeff Sulm
 * @license 2018
 */

/* jslint node: true */
'use strict';

const fs = require('fs');
const async = require('async');
const path = require('path');
const logger = require('./logger.js');

const thisDir = fs.realpathSync(__dirname);
const CONFIG_DIR = path.join(thisDir, '../../config');
const DEFAULT_FILE = 'default.json';

exports.CONFIG_VERSION = '1.0';
exports.MAIN_HOST = '127.0.0.1';
exports.MAIN_PORT = 8080;             // Number above 1000 so don't need sudo.

exports.log = {};

exports.log.isDev = true;
exports.log.isDebug = true;
exports.log.isInfo = true;
exports.log.isWarn = true;
exports.log.isError = true;
exports.log.consoleLevel = 'dev';

exports.passwdFile = '/etc/passwd';
exports.groupFile = '/etc/group';

exports.loadConfig = function(callback) {
	let deployment = process.env.NODE_ENV || 'dev';
  let isEnvSet = (process.env.NODE_ENV === undefined) ? false : true;
  let isUserConfigLoaded = false;

  // Check for config directory.
  fs.exists(CONFIG_DIR, function dirExistReturn(exists) {
    if (exists) {
      async.series([
        function readDefaultConfig(next) {
          // Check for default config file.
          let configFile = CONFIG_DIR +
                            '/' +
                            DEFAULT_FILE;

          fs.exists(configFile, function fileExistReturn(exists) {
            if (exists) {
              fs.readFile(configFile, function readFileReturn(err, data) {
                if (err) return next(err);

                var retval = JSON.parse(data);
                loadConfigData(retval);
                return next();
              });
            } else {
              console.log('warn: %s', 'Default configuration file does not ' +
                  'exist. This file is expected: ./config/default.json.');
              return next();
            }
          });
        },
        function readUserConfig(next) {
          if (!isEnvSet) {
            console.log('warn: %s', 'Deployment environment variable ' +
                'NODE_ENV is not set. Using development settings.\nExample:\texport NODE_ENV=dev\n\t\texport NODE_ENV=production');
            isUserConfigLoaded = true;
            return next();
          }

          // Check for user set config file.
          let configFile = CONFIG_DIR +
                            '/' +
                            deployment +
                            '.json';

          console.log('info: User Config File: ' + configFile);
          fs.exists(configFile, function fileExistReturn(exists) {
            if (exists) {
              fs.readFile(configFile, function readFileReturn(err, data) {
                if (err) return next(err);

                isUserConfigLoaded = true;
                var retval = JSON.parse(data);
                loadConfigData(retval);
                return next();
              });
            } else {
              console.log('warn: Configuration file does not exist. ' +
                  'Make sure %s exists as specified by NODE_ENV deployment ' +
                  'environment variable. Using ' +
                  'config/default.json instead.', configFile);
              return next();
            }
          });
        },
      ], function allDone(err) {
        if (err) return callback(false);

        if (isUserConfigLoaded) {
          logger.setLogLevel(exports);

          console.log('info: Configuration loaded successfully: %s',
              deployment);
          return callback(true);
        }
      });
    } else {
      // Log warning and use default configuration.
      console.log('warn: %s', 'Config directory does not exist.');
      return callback(false);
    }
  });
};

// /////////////////////////////////////////////////////////////////////////////
// Private Methods

let loadConfigData = function(data) {
  exports.CONFIG_VERSION = data.config.version;

  exports.MAIN_HOST = data.main.host;
  exports.MAIN_PORT = parseInt(data.main.port, 10);

  exports.log.isDev = data.log.isDev;
  exports.log.isDebug = data.log.isDebug;
  exports.log.isInfo = data.log.isInfo;
  exports.log.isWarn = data.log.isWarn;
  exports.log.isError = data.log.isError;
  exports.log.consoleLevel = data.log.consoleLevel;

  exports.passwdFile = data.passwdFile;
  exports.groupFile = data.groupFile;
};
