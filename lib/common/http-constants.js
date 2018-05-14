/**
 * HTTP Constants
 *
 * @author Jeff Sulm
 * @license 2018
 */

 /* jslint node: true */
'use strict';

// /////////////////////////////////////////////////////////////////////////////
// HTTP CODES
// These HTTP codes are returned to the client.

exports.OK = {
  code: 200,
  text: 'OK',
  desc: 'Success',
};

exports.NO_CONTENT = {
  code: 204,
  text: 'No Content',
  desc: 'The server successfully processed the request, but it is not ' +
    'returning any content.',
};

exports.BAD_REQUEST = {
  code: 400,
  text: 'Bad Request',
  desc: 'The request was invalid.',
};

exports.NOT_FOUND = {
  code: 404,
  text: 'Not Found',
  desc: 'The URI requested is invalid or the resource requested, ' +
    'such as a user, does not exist.',
};

exports.NOT_ACCEPTABLE = {
  code: 406,
  text: 'Not Acceptable',
  desc: 'The format of the request was invalid.',
};

exports.INTERNAL_SERVER_ERROR = {
  code: 500,
  text: 'Internal Server Error',
  desc: 'Something is broken.',
};

exports.SERVER_DATA_MISSING = {
  code: 505,
  text: 'Server Data Missing',
  desc: 'Server data is missing.',
};

exports.SERVER_DATA_CORRUPT = {
  code: 506,
  text: 'Server Data Corrupt',
  desc: 'Server data is corrupt.',
};


