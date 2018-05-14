/**
 * A wrapper around the winston logging module.
 *
 * @author Jeff Sulm
 * @license 2018
 */

'use strict';

const winston = require('winston');
const fs = require('fs');
const path = require('path');

// Make sure log directory exists.
const thisDir = fs.realpathSync(__dirname);
const logDir = path.join(thisDir, '../../log');

fs.exists(logDir, function(exists) {
  if (!exists) {
    fs.mkdir(logDir, function(err) {
      if (err) throw err;
    });
  }
});

let config = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    dev: 4,
  },
  colors: {
    error: 'underline',
    warn: 'yellow',
    info: 'cyan',
    debug: 'white',
    dev: 'green',
  },
  // Currently supports the standard set of 8 ANSI colors
  // (black, red, green, yellow, blue, magenta, cyan, white), along with
  // underline.
};

winston.addColors(config.colors);

let logger = module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      level: 'dev',
      colorize: true,
    }),
    new (winston.transports.File)({
      name: 'file.debug',
      level: 'debug', // Write debug or higher log items.
      filename: logDir + '/debug.log',
      // maxsize: Max size in bytes of the logfile,
      // if the size is exceeded then a new file is created.
      maxsize: 10485760, // 10MB or 1024 * 1024 * 10.
    }),

    // Categorize log files by additional types.
    new (winston.transports.File)({
      name: 'file.info',
      level: 'info', // Write info or higher log items.
      filename: logDir + '/info.log',
      // maxsize: Max size in bytes of the logfile,
      // if the size is exceeded then a new file is created.
      maxsize: 10485760, // 10MB or 1024 * 1024 * 10.
    }),
    new (winston.transports.File)({
      name: 'file.warn',
      level: 'warn', // Write warn or higher log items.
      filename: logDir + '/warn.log',
      // maxsize: Max size in bytes of the logfile,
      // if the size is exceeded then a new file is created.
      maxsize: 10485760, // 10MB or 1024 * 1024 * 10.
    }),
    new (winston.transports.File)({
      name: 'file.error',
      level: 'error', // Write error log items, the highest level.
      filename: logDir + '/error.log',
      // maxsize: Max size in bytes of the logfile,
      // if the size is exceeded then a new file is created.
      maxsize: 10485760, // 10MB or 1024 * 1024 * 10.
    }),
  ],
  levels: config.levels,
  colors: config.colors,
});

// Place exceptions into file and do not exit program.
logger.handleExceptions(new winston.transports.File({
  filename: logDir + '/exception.log',
  // NOTE: The maxsize for exceptions is not working in winston 0.7.1
  // maxsize: Max size in bytes of the logfile,
  // if the size is exceeded then a new file is created.
  maxsize: 10485760,
})); // 10MB or 1024 * 1024 * 10.

logger.exitOnError = false;
logger.options = config;
