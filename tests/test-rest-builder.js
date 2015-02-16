var assert = require('chai').assert;
var rewire = require('rewire');
var RestBuilder = rewire('../lib/rest-builder');
var mock = require('mock-object');
var mockDB = mock(require('../lib/db'));
var shared = require('./util/shared');
var user = require('./util/models/user');
var noarg = require('./util/noarg');

mockDB.get.addSideEffect(function() {
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  cb(null, {});
});

RestBuilder.__set__('db', mockDB);

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

describe('RestBuilder', function() {
  describe('defineGetSingle', function() {
    setUpRestBuilder();
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
        var called = false;
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
