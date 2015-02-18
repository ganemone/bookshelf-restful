var assert = require('chai').assert;
var rewire = require('rewire');
var mock = require('mock-object');
var clearTable = require('../util/clearTable');
var User = require('../util/models/user');

var mockResBuilder = mock(require('../../lib/response-builder'));
var db = rewire('../../lib/db');

db.__set__('resBuilder', mockResBuilder);
mockResBuilder.get200.returns({ key: 'value' });

describe('db.add', function () {
  afterEach(function () {
    mockResBuilder.reset();
  });
  clearTable('users');
  it('should add data in a model correctly', function (done) {
    db.add(User, {
      username: 'ganemone',
      name: 'Giancarlo Anemone',
      email: 'email@gmail.com',
      password: 'password'
    }, function(error, result) {
      assert.ifError(error);
      assert.deepEqual(result, { key: 'value' });
      mockResBuilder.get200.assertCalledOnce();
      done();
    });
  });
});