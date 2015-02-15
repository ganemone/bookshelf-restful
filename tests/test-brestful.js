var assert = require('assert');
var BRestful = require('../lib/brestful');
var server, bookshelf = require('./util/shared');
var User = require('./util/models/user');

describe('brestful', function() {
  describe('the constructor', function() {
    var rest = new BRestful(server, bookshelf);
    it('should set the server as app', function() {
      assert.equal(server, rest.app);
    });
    it('should set the bookshelf as db', function() {
      assert.equal(bookshelf, rest.db);
    });
    it('should create a rest builder', function() {
      assert.ok(rest.builder);
    });
  });
});

describe('user', function() {
  it('should be cool', function(done) {
    User.forge({
      name: 'Giancarlo Anemone',
      username: 'ganemone',
      password: 'password',
      email: 'email'
    }).save().then(function() {
      console.log('Created Users: ', arguments);
      done();
    });
  });
});