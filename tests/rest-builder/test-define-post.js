var assert = require('chai').assert;
var user = require('../util/models/user');
var util = require('./rest-builder-util');

var postData = {
  key: 'value'
};

describe('RestBuilder', function() {
  describe('definePost', function() {
    util.setUp();
    describe('no processors', function() {
      it('should call db.del', function(done) {
        this.rb.definePost('users', user, [], []);
        this.client.post('/users', postData, function(err, req, res) {
          assert.ifError(err);
          util.mockDB.add.assertCalledOnceWithArgsIncluding(
            [user, postData]
          );
          done();
        });
      });
    });
    describe('with preprocessors', function () {
      it('should call a single preprocessor', function(done) {
        var mockPre = util.getMockPre();
        this.rb.definePost('users', user, [mockPre], []);
        this.client.post('/users', postData, function(err, req, res) {
          mockPre.assertCalled('should call preprocessors');
          assert.ifError(err);
          util.mockDB.add.assertCalledOnceWithArgsIncluding(
            [user, postData]
          );
          done();
        });
      });
      it('should call all the preprocessors', function (done) {
        var mockPre = util.getMockPre();
        var _mockPre = util.getMockPre();
        this.rb.definePost('users', user, [mockPre, _mockPre], []);
        this.client.post('/users', postData, function(err, req, res) {
          mockPre.assertCalled('should call first preprocessor');
          _mockPre.assertCalled('should call second preprocessor');
          assert.ifError(err);
          util.mockDB.add.assertCalledOnceWithArgsIncluding(
            [user, postData]
          );
          done();
        });
      });
    });
  });
});
