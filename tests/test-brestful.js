var assert = require('chai').assert;
var rewire = require('rewire');
var BRestful = rewire('../lib/brestful');
var server, bookshelf = require('./util/shared');
var mock = require('./util/mock');
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
      rest.createAPI(User, ['GET']);
      rest.builder.defineGetSingle.assertCalledOnceWith([User, [], []]);
      rest.builder.defineGetMany.assertCalledOnceWith([User, [], []]);
    });
    it('GET + POST', function() {
      rest.builder.reset();
      rest.createAPI(User, ['GET', 'POST'], {
        'GET': {
          'SINGLE': ['single'],
          'MANY': ['many']
        }
      }, {
        'GET': {
          'SINGLE': ['single'],
          'MANY': ['many']
        }
      });
      rest.builder.defineGetSingle.assertCalledOnceWith([User, ['single'], ['single']]);
      rest.builder.defineGetMany.assertCalledOnceWith([User, ['many'], ['many']]);
      rest.builder.definePost.assertCalledOnceWith([User, [], []]);
    });
    it('ALL', function() {
      rest.builder.reset();
      rest.createAPI(
        User,
        ['GET', 'POST', 'PUT', 'DELETE'],
        {
          'POST': ['post'],
          'PUT': ['put'],
        },
        {
          'POST': ['post'],
          'DELETE': ['delete']
        }
      );
      rest.builder.defineGetSingle.assertCalledOnceWith([User, [], []]);
      rest.builder.defineGetMany.assertCalledOnceWith([User, [], []]);
      rest.builder.definePost.assertCalledOnceWith([User, ['post'], ['post']]);
      rest.builder.definePut.assertCalledOnceWith([User, ['put'], []]);
      rest.builder.defineDelete.assertCalledOnceWith([User, [], ['delete']]);
    });
  });
});