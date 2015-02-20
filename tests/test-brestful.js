var assert = require('chai').assert;
var rewire = require('rewire');
var BRestful = rewire('../lib/brestful');
var server, bookshelf = require('./util/shared');
var mock = require('mock-object');
var User = require('./util/models/user')
var mockBuilder = mock(require('../lib/rest-builder'));

BRestful.__set__('RestBuilder', mockBuilder);

describe('brestful', function() {
  var rest = new BRestful(server, bookshelf);
  describe('the constructor', function() {
    it('should set the server as app', function() {
      assert.equal(server, rest.app);
    });
    it('should set the bookshelf as db', function() {
      assert.equal(bookshelf, rest.db);
    });
    it('should create a rest builder', function() {
      assert.ok(rest.builder);
    });
    it('should set up the mock correctly', function() {
      assert.equal(typeof rest.builder.reset, 'function');
    });
  });
  describe('createAPI', function() {
    it('GET', function() {
      rest.createAPI({
        'collection': User,
        'methods': ['GET']
      });
      rest.builder.defineGetSingle.assertCalledOnceWith(['users', User, [], []]);
      rest.builder.defineGetMany.assertCalledOnceWith(['users', User, [], []]);
    });
    it('GET + POST', function() {
      rest.builder.reset();
      rest.createAPI({
        'collection': User,
        'methods': ['GET', 'POST'],
        'preprocessors': {
          'GET': {
            'SINGLE': ['single'],
            'MANY': ['many']
          }
        },
        'postprocessors': {
          'GET': {
            'SINGLE': ['single'],
            'MANY': ['many']
          }
        }
      });
      rest.builder.defineGetSingle.assertCalledOnceWith(['users', User, ['single'], ['single']]);
      rest.builder.defineGetMany.assertCalledOnceWith(['users', User, ['many'], ['many']]);
      rest.builder.definePost.assertCalledOnceWith(['users', User, [], []]);
    });
    it('ALL', function() {
      rest.builder.reset();
      rest.createAPI({
        'collection': User,
        'methods': ['GET', 'POST', 'PUT', 'DELETE'],
        'preprocessors': {
          'POST': ['post'],
          'PUT': ['put'],
        },
        'postprocessors': {
          'POST': ['post'],
          'DELETE': ['delete']
        }
      });
      rest.builder.defineGetSingle.assertCalledOnceWith(['users', User, [], []]);
      rest.builder.defineGetMany.assertCalledOnceWith(['users', User, [], []]);
      rest.builder.definePost.assertCalledOnceWith(['users', User, ['post'], ['post']]);
      rest.builder.definePut.assertCalledOnceWith(['users', User, ['put'], []]);
      rest.builder.defineDelete.assertCalledOnceWith(['users', User, [], ['delete']]);
    });
  });
});