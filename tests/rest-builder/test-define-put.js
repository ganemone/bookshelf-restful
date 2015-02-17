var assert = require('chai').assert;
var user = require('../util/models/user');
var util = require('./rest-builder-util');

var putObj = {
  key: 'value'
};

var putData = {
  q: putObj
};


describe('RestBuilder', function() {
  describe('definePut', function() {
    util.setUp();
    describe('no processors', function() {
      it('should call db.del', function(done) {
        this.rb.definePut('users', user, [], []);
        this.client.put('/users/1', putData, function(err, req, res) {
          assert.ifError(err);
          util.mockDB.update.assertCalledOnceWithArgsIncluding(
            ['1', user, putObj]
          );
          done();
        });
      });
    });
    describe('with preprocessors', function () {
      it('should call a single preprocessor', function(done) {
        var mockPre = util.getMockPre();
        this.rb.definePut('users', user, [mockPre], []);
        this.client.put('/users/1', putData, function(err, req, res) {
          mockPre.assertCalled('should call preprocessors');
          assert.ifError(err);
          util.mockDB.update.assertCalledOnceWithArgsIncluding(
            ['1', user, putObj]
          );
          done();
        });
      });
      it('should call all the preprocessors', function (done) {
        var mockPre = util.getMockPre();
        var _mockPre = util.getMockPre();
        this.rb.definePut('users', user, [mockPre, _mockPre], []);
        this.client.put('/users/1', putData, function(err, req, res) {
          mockPre.assertCalled('should call first preprocessor');
          _mockPre.assertCalled('should call second preprocessor');
          assert.ifError(err);
          util.mockDB.update.assertCalledOnceWithArgsIncluding(
            ['1', user, putObj]
          );
          done();
        });
      });
    });
  });
});
