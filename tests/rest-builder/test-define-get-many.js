var assert = require('chai').assert;
var user = require('../util/models/user');
var util = require('./rest-builder-util');
var mockDB = util.mockDB;
var searchParams = util.searchParams;
var getMockPre = util.getMockPre;

describe('RestBuilder', function() {
  describe('defineGetMany', function () {
    util.setUp();
    describe('no processors', function () {
      it('should call db.get with no params', function (done) {
        this.rb.defineGetMany('users', user, [], []);
        this.client.get('/users', function(err, req, res) {
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding([user]);
          done();
        });
      });
      it('should call db.get with params', function (done) {
        this.rb.defineGetMany('users', user, [], []);
        this.client.get('/users?q=' + searchParams, function(err, req, res) {
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding([user]);
          done();
        });
      });
    });
    describe('with preprocessors', function () {
      it('should call db.get without params', function (done) {
        var pre = [getMockPre(), getMockPre()];
        this.rb.defineGetMany('users', user, pre, []);
        this.client.get('/users', function(err, req, res) {
          pre[0].assertCalled('should call first preprocessor');
          pre[1].assertCalled('should call second preprocessor');
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding([user]);
          done();
        });
      });
      it('should call db.get with params', function (done) {
        var pre = [getMockPre(), getMockPre()];
        this.rb.defineGetMany('users', user, pre, []);
        this.client.get('/users?q=' + searchParams, function(err, req, res) {
          pre[0].assertCalled('should call first preprocessor');
          pre[1].assertCalled('should call second preprocessor');
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding([user]);
          done();
        });
      });
    });
  });
});
