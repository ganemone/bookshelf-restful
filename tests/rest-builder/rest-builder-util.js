var assert = require('assert');
var rewire = require('rewire');
var mock = require('mock-object');
var noarg = require('../util/noarg');
var shared = require('../util/shared');
var RestBuilder = rewire('../../lib/rest-builder');
var mockDB = mock(require('../../lib/db'));

mockDB.add.addSideEffect(cbSideEffect);
mockDB.update.addSideEffect(cbSideEffect);
mockDB.delete.addSideEffect(cbSideEffect);
mockDB.get.addSideEffect(cbSideEffect);

RestBuilder.__set__('db', mockDB);

function getMockPre() {
  var called = false;
  function mockPre(req, res, next) {
    called = true;
    return next();
  }
  mockPre.assertCalled = function assertCalled(message) {
    assert.ok(called, message);
  };
  return mockPre;
}

function cbSideEffect() {
  console.log('Calling Callback');
  var args = Array.prototype.slice.call(arguments);
  var cb = args.pop();
  cb(null, {});
}

function setUpRestBuilder() {
  beforeEach(function(done) {
    this.server = shared.createServer();
    this.rb = new RestBuilder(this.server);
    this.client = shared.createClient();
    mockDB.reset();
    this.server.listen(8080, noarg(done));
  });
  afterEach(function() {
    this.server.close();
    this.server = null;
    this.client = null;
  });
}

var searchParams = JSON.stringify({
  filters: {
    'username': 'somestuff'
  }
});

exports.mockDB = mockDB;
exports.searchParams = searchParams;
exports.setUp = setUpRestBuilder;
exports.getMockPre = getMockPre;
