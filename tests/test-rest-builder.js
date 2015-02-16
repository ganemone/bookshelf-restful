var assert = require('chai').assert;
var rewire = require('rewire');
var RestBuilder = rewire('../lib/rest-builder');
var mock = require('./util/mock');
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
  });
  afterEach(function() {
    this.server.close();
  });
}

describe('RestBuilder', function() {
  describe('defineGetSingle', function() {
    describe('no processors', function() {
      setUpRestBuilder();
      it('should call db.get when a request comes it', function(done) {
        this.rb.defineGetSingle('users', user, [], []);
        shared.client.get('/users/1', function(err, req, res, obj) {
          assert.ifError(err);
          mockDB.get.assertCalledOnceWithArgsIncluding(['1', user]);
          done();
        });
      });
    });
  });
});
