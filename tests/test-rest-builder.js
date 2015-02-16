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
  before(function(done) {
    this.server = shared.createServer();
    this.rb = new RestBuilder(this.server);
    this.server.listen(8080, noarg(done));
    this.client = shared.createClient();
  });
  after(function() {
    this.server.close();
    this.server = null;
    this.client = null;
  });
}

describe('RestBuilder', function() {
  describe('defineGetSingle', function() {
    describe('no processors', function() {
      setUpRestBuilder();
      it('should call db.get', function(done) {
        this.rb.defineGetSingle('users', user, [], []);
        this.client.get('/users/1', function(err, req, res) {
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
    describe('test', function () {
      setUpRestBuilder();
      it('should call db.get', function(done) {
        var called = false;
        function mockPre(req, res, next) {
          called = true;
          return next();
        }
        this.rb.defineGetSingle('users', user, [mockPre], []);
        this.client.get('/users/1', function(err, req, res) {
          assert.ok(called, 'should call preprocessors');
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
  });
});
