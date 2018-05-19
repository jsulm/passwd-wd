/**
 * HTTP Constants
 *
 * @author Jeff Sulm
 * @license 2018
 */

 'use strict';

 const logger = require('../common/logger.js');
 const HTTP_C = require('../common/http-constants.js');

 // Helper function to get parameter values, if present
exports.getParameter = function(params, name) {
  // was
  // return (typeof params[name] === 'undefined') ? '' : params[name];
  return (params[name] === undefined) ? '' : params[name];
};

// Pass result error code to be sent by middleware by putting into request
// readyToSend.
exports.saveResultInRequest = function(req, statusDetails, result) {
  req.readyToSend = {};
  req.readyToSend.code = statusDetails.code;
  req.readyToSend.text = statusDetails.text;
  req.readyToSend.result = result;
};

// Pass details for error result code  for logging request readyToLogError.
exports.saveErrorDetailsInRequest = function(req, errorDetails, details) {
  req.readyToLogError = {};
  req.readyToLogError.code = errorDetails.code;
  req.readyToLogError.text = errorDetails.text;
  req.readyToLogError.details = details;
};

// Error reporting
exports.onError = function(err, req, callback) {
  // logger.log('error', 'UNEXPECTED ERROR %s', err);
  // logger.log('error', 'STACK', err.stack);

  if (callback !== undefined) {
    exports.saveResultInRequest(req, HTTP_C.INTERNAL_SERVER_ERROR);
    return callback();
  }
};

/**
 * Prepares a service result before sending the response to client.
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 */
exports.processResults = function(req, res, next) {
  if (req.readyToSend === undefined) {
    req.readyToSend = {};
    req.readyToSend.code = HTTP_C.NOT_FOUND.code;
    req.readyToSend.text = HTTP_C.NOT_FOUND.text;
  } else if (req.readyToSend.code === undefined) {
    req.readyToSend.code = HTTP_C.SERVER_DATA_MISSING.code;
    req.readyToSend.text = HTTP_C.SERVER_DATA_MISSING.text;
  }

  if (req.readyToSend.result !== undefined &&
      typeof req.readyToSend.result !== 'object' &&
      typeof req.readyToSend.result !== 'string') {
    logger.log('dev', 'Result typeof ', (typeof req.readyToSend.result));
    req.readyToSend.result = JSON.stringify({retcode: req.readyToSend.result});
  }

  if (next.name === 'next') {
    next();
  } else {
    next(req, res, next);
  }
};

/**
 * Handles logging of error details of an invalid request on server.
 * @param  {[type]}   req
 * @param  {[type]}   res
 * @param  {Function} next
 */
exports.processErrorDetails = function(req, res, next) {
  if (req.readyToLogError !== undefined) {
    logger.warn(req.readyToLogError);
    logger.warn('Sending to client: ' + req.readyToSend.code);
  }

  if (next.name === 'next') {
    next();
  } else {
    next(req, res, next);
  }
};

/**
 * Handles sending a response.
 * Note that if sessions are used then processCall should be used instead.
 * @param  {[type]} req
 * @param  {[type]} res
 */
exports.sendResults = function(req, res) {
  req.readyToSend.headers = {};

  // Send out JSON result; don't keep connection alive
  req.readyToSend.headers['connection'] = 'close';
  req.readyToSend.headers['content-type'] = 'application/json';
  req.readyToSend.headers['cache-control'] = 'no-cache, private, no-store, ' +
      'must-revalidate, max-stale=0, post-check=0, pre-check=0';

  // The Connect cookieSession middleware only writes set-cookie to header if
  // there was a change to the cookie. You cannot view this header value from
  // the server because Connect writes it on an overloaded res.end().
  // It does this automatically and you do not need to set it manually.

  if (req.readyToSend.result !== undefined) {
    req.readyToSend.headers['content-length'] = req.readyToSend.result.length;
    // headers['transfer-encoding'] = 'chunked';
  } else {
    req.readyToSend.headers['content-length'] = 0;
    req.readyToSend.result = '';
  }

  req.readyToSend.headers['x-content-type-options'] = 'nosniff';
  // For IE web browser clients.
  req.readyToSend.headers['x-frame-options'] = 'deny';

  // Info logging
  let ip = (req.locals !== undefined && req.locals.ip != undefined) ?
      ' ' + req.locals.ip : '';
  let result = req.readyToSend.result !== undefined ?
      ' ' + req.readyToSend.result : '';
  logger.log('info', 'Sending ' + req.readyToSend.code +
                     result +
                     ip);

  // logger.log('info', 'headers', req.readyToSend.headers);

  res.writeHead(req.readyToSend.code,
                req.readyToSend.text,
                req.readyToSend.headers);

  if (req.readyToSend.result !== undefined) {
    // IMPORTANT: Avoid HTTP Parse Error on client by writing body after
    // the header!
    res.write(req.readyToSend.result);
  }

  res.end();
};

 // JSON
 // http://stackoverflow.com/questions/9804777/how-to-test-if-a-string-is-json-or-not
exports.isJSON = function(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
};