/**
 * This is a web service allowing requests to the etc/passwd and etc/groups
 * files.
 *
 * @author Jeff Sulm
 * @license 2018
 */

/* jslint node: true */
'use strict';

const app = require('../../main/server.js');
const config = require('../../lib/common/config.js');
const request = require('supertest');
const assert = require('assert');

let req = {};

config.loadConfig(function configReturn(isConfigLoaded) {
  if (!isConfigLoaded) {
    config.log('error', 'Could not load server configuration.');
    return;
  }

  // Using config-specified server location.
  let uri = 'http://' + config.MAIN_HOST + ':' + config.MAIN_PORT;
  req = request(uri);
})

/**
 * After launching the server, wait for it to be finished launching before
 * running tests.
 */
describe('Test Setup', function() {
  function start(done) {
    assert.equal(true, true);
    done();
  }

  it('should respond with Starting on port...', function(done) {
    setTimeout(function () {
      start(done);
    }, 1000);
  });
});

/**
 * Test /v1/users
 */
describe('GET /v1/users', function() {
  it('should respond with json data', function(done) {
    req
      .get('/v1/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /v1/users/query?name=root', function() {
  it('should respond with json data', function(done) {
    req
      .get('/v1/users/query?name=root')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /v1/users/query?name=baduser', function() {
  it('should respond with 204', function(done) {
    req
      .get('/v1/users/query?name=baduser')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(204, done);
  });
});

describe('GET /v1/users/query?badname=root', function() {
  it('should respond with 400', function(done) {
    req
      .get('/v1/users/query?badname=root')
      .set('Accept', 'application/json')
      .expect(400, done);
  });
});

describe('GET /v1/invalid-api', function() {
  it('should respond with 404', function(done) {
    req
      .get('/v1/invalid-api')
      .set('Accept', 'application/json')
      .expect(404, done);
  });
});

describe('GET /v1/users/0', function() {
  it('should respond with 200', function(done) {
    req
      .get('/v1/users/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /v1/users/0/groups', function() {
  it('should respond with 200', function(done) {
    req
      .get('/v1/users/0/groups')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

/**
 * Test/v1/groups
 */
describe('GET /v1/groups', function() {
  it('should respond with json data', function(done) {
    req
      .get('/v1/groups')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /v1/groups/query?name=nogroup', function() {
  it('should respond with json data', function(done) {
    req
      .get('/v1/groups/query?name=nogroup')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('GET /v1/groups/query?name=nogroup&member=ubuntu', function() {
  it('should respond with no content', function(done) {
    req
      .get('/v1/groups/query?name=nogroup&member=ubuntu')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(204, done);
  });
});

describe('GET /v1/groups/query?name=badgroup', function() {
  it('should respond with 204', function(done) {
    req
      .get('/v1/groups/query?name=badgroup')
      .set('Accept', 'application/json')
      .expect(204, done);
  });
});

describe('GET /v1/groups/query?badname=badgroup', function() {
  it('should respond with 400', function(done) {
    req
      .get('/v1/groups/query?badname=badgroup')
      .set('Accept', 'application/json')
      .expect(400, done);
  });
});

describe('GET /v1/groups/0', function() {
  it('should respond with json data', function(done) {
    req
      .get('/v1/groups/0')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});