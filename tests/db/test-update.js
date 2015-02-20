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

describe('db.update', function () {
  afterEach(function () {
    mockResBuilder.reset();
  });

  clearTable('users');
});