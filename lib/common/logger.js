/**
 * Adds functionality to change logging level to winston-wrapper based on config.
 *
 * @author Jeff Sulm
 * @license 2018
 */

'use strict';

const logger = require('./winston_wrapper.js');

logger.setLogLevel = function(config) {
  // Setting log transport
  // "none" is an invalid level, which means do not write to transport.
  if (!config.log.isDebug) {
    logger.transports['file.debug'].level = 'none';
  }

  if (!config.log.isInfo) {
    logger.transports['file.info'].level = 'none';
  }

  if (!config.log.isWarn) {
    logger.transports['file.warn'].level = 'none';
  }

  if (!config.log.isError) {
    logger.transports['file.error'].level = 'none';
  }

  logger.transports['console'].level = config.log.consoleLevel;
};

module.exports = logger;