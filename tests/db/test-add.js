var assert = require('chai').assert;
var rewire = require('rewire');
var mock = require('mock-object');
var clearTable = require('../util/clearTable');
var User = require('../util/models/user');

var mockResBuilder = mock(require('../../lib/response-builder'));
var db = rewire('../../lib/db');

db.__set__('resBuilder', mockResBuilder);
mockResBuilder.get201.returns({ key: 'value' });
mockResBuilder.get400.returns({ message: 'message' });

describe('db.add', function () {
  afterEach(function () {
    mockResBuilder.reset();
  });
  clearTable('users');
  it('should respond with a 201 when successfully added', function (done) {
    db.add(User, {
      username: 'ganemone',
      name: 'Giancarlo Anemone',
      email: 'email@gmail.com',
      password: 'password'
    }, function(error, result) {
      assert.ifError(error);
      assert.deepEqual(result, { key: 'value' });
      mockResBuilder.get201.assertCalledOnce();
      done();
    });
  });
  it('should send a 400 when a bad field is given', function (done) {
    db.add(User, {
      invalid: 'invalid'
    }, function(error, result) {
      assert.ifError(error);
      assert.deepEqual(result, { message: 'message' });
      mockResBuilder.get400.assertCalledOnce();
      done();
    });
  });
});