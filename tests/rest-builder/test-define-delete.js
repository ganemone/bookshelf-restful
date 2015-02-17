var assert = require('chai').assert;
var rewire = require('rewire');
var RestBuilder = rewire('../../lib/rest-builder');
var mock = require('mock-object');
var mockDB = mock(require('../../lib/db'));
var shared = require('../util/shared');
var user = require('../util/models/user');
var noarg = require('../util/noarg');

mockDB.delete.addSideEffect(cbSideEffect);

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
  describe('defineDelete', function() {
    setUpRestBuilder();
    describe('no processors', function() {
      it('should call db.del', function(done) {
        this.rb.defineDelete('users', user, [], []);
        this.client.del('/users/1', function(err, req, res) {
          assert.ifError(err);
          mockDB.delete.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
    describe('with preprocessors', function () {
      it('should call a single preprocessor', function(done) {
        var called = false;
        var mockPre = getMockPre();
        this.rb.defineDelete('users', user, [mockPre], []);
        this.client.del('/users/1', function(err, req, res) {
          mockPre.assertCalled('should call preprocessors');
          assert.ifError(err);
          mockDB.delete.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
      it('should call all the preprocessors', function (done) {
        var mockPre = getMockPre();
        var _mockPre = getMockPre();
        this.rb.defineDelete('users', user, [mockPre, _mockPre], []);
        this.client.del('/users/1', function(err, req, res) {
          mockPre.assertCalled('should call first preprocessor');
          _mockPre.assertCalled('should call second preprocessor');
          assert.ifError(err);
          mockDB.delete.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
  });
});
