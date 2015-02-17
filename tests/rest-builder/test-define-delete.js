var assert = require('chai').assert;
var user = require('../util/models/user');
var util = require('./rest-builder-util');

describe('RestBuilder', function() {
  describe('defineDelete', function() {
    util.setUp();
    describe('no processors', function() {
      it('should call db.del', function(done) {
        this.rb.defineDelete('users', user, [], []);
        this.client.del('/users/1', function(err, req, res) {
          assert.ifError(err);
          util.mockDB.delete.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
    describe('with preprocessors', function () {
      it('should call a single preprocessor', function(done) {
        var mockPre = util.getMockPre();
        this.rb.defineDelete('users', user, [mockPre], []);
        this.client.del('/users/1', function(err, req, res) {
          mockPre.assertCalled('should call preprocessors');
          assert.ifError(err);
          util.mockDB.delete.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
      it('should call all the preprocessors', function (done) {
        var mockPre = util.getMockPre();
        var _mockPre = util.getMockPre();
        this.rb.defineDelete('users', user, [mockPre, _mockPre], []);
        this.client.del('/users/1', function(err, req, res) {
          mockPre.assertCalled('should call first preprocessor');
          _mockPre.assertCalled('should call second preprocessor');
          assert.ifError(err);
          util.mockDB.delete.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
  });
});
