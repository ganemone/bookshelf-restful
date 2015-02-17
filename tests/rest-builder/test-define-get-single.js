var assert = require('chai').assert;
var user = require('../util/models/user');
var util = require('./rest-builder-util');
var mockDB = util.mockDB;
var getMockPre = util.getMockPre;

describe('RestBuilder', function() {
  describe('defineGetSingle', function() {
    util.setUp();
    describe('no processors', function() {
      it('should call db.get', function(done) {
        this.rb.defineGetSingle('users', user, [], []);
        this.client.get('/users/1', function(err, req, res) {
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
    describe('with preprocessors', function () {
      it('should call a single preprocessor', function(done) {
        var mockPre = getMockPre();
        this.rb.defineGetSingle('users', user, [mockPre], []);
        this.client.get('/users/1', function(err, req, res) {
          mockPre.assertCalled('should call preprocessors');
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
      it('should call all the preprocessors', function (done) {
        var mockPre = getMockPre();
        var _mockPre = getMockPre();
        this.rb.defineGetSingle('users', user, [mockPre, _mockPre], []);
        this.client.get('/users/1', function(err, req, res) {
          mockPre.assertCalled('should call first preprocessor');
          _mockPre.assertCalled('should call second preprocessor');
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
  });
});