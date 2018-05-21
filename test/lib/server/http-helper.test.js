/**
 * Tests for http-helper.js
 *
 * @author Jeff Sulm
 * @license 2018
 */

/* jslint node: true */
'use strict';

const assert = require('assert');
const httpHelper = require('../../../lib/server/http-helper.js');
const HTTP_C = require('../../../lib/common/http-constants.js');

describe('saveResultInRequest', function() {
  it('should save result code in req obj', function() {
    let req = {};
    httpHelper.saveResultInRequest(req, HTTP_C.OK, '');
    assert.equal(req.readyToSend.code, HTTP_C.OK.code);
  });
});

describe('saveErrorDetailsInRequest', function() {
  it('should save error code in req obj', function() {
    let req = {};
    httpHelper.saveResultInRequest(req, HTTP_C.BAD_REQUEST, '');
    assert.equal(req.readyToSend.code, HTTP_C.BAD_REQUEST.code);
  });
});

describe('onError', function() {
  it('should save INTERNAL_SERVER_ERROR code in req obj', function() {
    let req = {};
    let err = -1;
    let returnOnError = function(err) {
      assert(req.readyToSend.code, HTTP_C.INTERNAL_SERVER_ERROR.code);
    };

    httpHelper.onError(err, req, returnOnError);
  });
});

describe('processResults', function() {
  it('should save OK in req obj', function() {
    let req = {};
    let res = {};

    httpHelper.saveResultInRequest(req, HTTP_C.OK, '');

    let callback = function(req, res, next) {
      assert.equal(req.readyToSend.code, HTTP_C.OK.code);
    };
    httpHelper.processResults(req, res, callback);
  });
});

describe('processResults', function() {
  it('should save NOT_FOUND in req obj', function() {
    let req = {};
    let res = {};

    let callback = function(req, res, next) {
      assert.equal(req.readyToSend.code, HTTP_C.NOT_FOUND.code);
    };
    httpHelper.processResults(req, res, callback);
  });
});

describe('processErrorDetails', function() {
  it('should call callback', function() {
    let req = {};
    let res = {};


    let callback = function(req, res, next) {
      assert.ok(true);
    };
    httpHelper.processErrorDetails(req, res, callback);
  });
});

describe('sendResults', function() {
  it('should write headers to req', function() {
    let req = {};
    let res = {};
    res.writeHead = function(code, text, headers) {};
    res.write = function(result) {};
    res.end = function() {};

    httpHelper.saveResultInRequest(req, HTTP_C.OK, '');
    httpHelper.sendResults(req, res);

    assert.notEqual(req.readyToSend.headers, undefined || null);
  });
});