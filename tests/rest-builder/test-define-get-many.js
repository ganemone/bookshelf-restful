var assert = require('chai').assert;
var rewire = require('rewire');
var RestBuilder = rewire('../../lib/rest-builder');
var mock = require('mock-object');
var mockDB = mock(require('../../lib/db'));
var shared = require('../util/shared');
var user = require('../util/models/user');
var noarg = require('../util/noarg');

mockDB.get.addSideEffect(cbSideEffect);

RestBuilder.__set__('db', mockDB);

function cbSideEffect() {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  cb(null, {});
}

function setUpRestBuilder() {
  beforeEach(function(done) {
    this.server = shared.createServer();
    this.rb = new RestBuilder(this.server);
    this.server.listen(8080, noarg(done));
    this.client = shared.createClient();
  });
  afterEach(function() {
    this.server.close();
    this.server = null;
    this.client = null;
  });
}

function getMockPre() {
  var called = false;
  function mockPre(req, res, next) {
    called = true;
    return next();
  }
  mockPre.assertCalled = function assertCalled(message) {
    assert.ok(called, message);
  }
  return mockPre;
}

var searchParams = JSON.stringify({
  filters: {
    'username': 'somestuff'
  }
});

describe('RestBuilder', function() {
  describe('defineGetMany', function () {
    setUpRestBuilder();
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
