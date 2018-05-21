/**
 * Tests for passwd-helper.js
 *
 * @author Jeff Sulm
 * @license 2018
 */

/* jslint node: true */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const passwdHelper = require('../../../lib/server/passwd-helper.js');
const thisDir = fs.realpathSync(__dirname);
const goodPasswdFile = path.join(thisDir, '../../data/passwd');
const badPasswdFile = path.join(thisDir, '../../data/passwd-bad');

const goodGroupFile = path.join(thisDir, '../../data/group');
const badGroupFile = path.join(thisDir, '../../data/group-bad');

describe('readUserData', function() {
  it('should have err null', function() {
    let returnReadUserData = function(err, data) {
      assert.equal(err, null);
    };

    passwdHelper.readUserData(goodPasswdFile, returnReadUserData);
  });

  it('should have err', function() {
    let returnReadUserData = function(err, data) {
      assert.notEqual(err, null);
    };

    passwdHelper.readUserData(badPasswdFile, returnReadUserData);
  });
});

describe('readGroupData', function() {
  it('should have err null', function() {
    let returnReadGroupData = function(err, data) {
      assert.equal(err, null);
    };

    passwdHelper.readGroupData(goodGroupFile, returnReadGroupData);
  });

  it('should have err', function() {
    let returnReadGroupData = function(err, data) {
      assert.notEqual(err, null);
    };

    passwdHelper.readGroupData(badGroupFile, returnReadGroupData);
  });
});
