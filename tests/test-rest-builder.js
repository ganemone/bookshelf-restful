var assert = require('chai').assert;
var rewire = require('rewire');
var RestBuilder = rewire('../lib/rest-builder');
var mock = require('./util/mock');
var mockDB = mock(require('../lib/db'));
var server, bookshelf, client = require('./util/shared');

RestBuilder.__set__('db', mockDB);

describe('RestBuilder', function() {
  var rb = new RestBuilder(server);
  describe('defineGetSingle', function() {

  });
});
