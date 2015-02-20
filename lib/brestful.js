var RestBuilder = require('./rest-builder.js');
var getNameFromCollection = require('./db').getNameFromCollection;

function BRestful(app, bookshelf) {
  this.app = app;
  this.db = bookshelf;
  this.builder = new RestBuilder(app);
}

BRestful.prototype.createAPI = function (apiObj) {
  var self = this;
  if (typeof apiObj !== 'object') {
    throw 'createAPI expected object, received ' + typeof apiObj;
  }
  if (apiObj.methods.constructor !== Array) {
    throw 'createAPI expected object with array of methods. Received: ' + apiObj.methods;
  }
  if (typeof apiObj.collection !== 'function') {
    throw 'createAPI expected collection to be an function. Received ' + typeof apiObj.collection;
  }
  var pre = apiObj.preprocessors || {};
  var post = apiObj.postprocessors || {};
  var collection = apiObj.collection;
  var name = getNameFromCollection(collection);
  apiObj.methods.forEach(function(method) {
    if (typeof self[method] === 'function') {
      var _pre = pre[method];
      return self[method].call(
        self,
        name,
        collection,
        pre[method],
        post[method]
      );
    }
    throw 'HTTP Method: ' + method + ' is either invalid or unsupported';
  });
};

BRestful.prototype.GET = function(name, collection, preprocessors, postprocessors) {
  var pre = preprocessors || {
    'SINGLE': [],
    'MANY': []
  };
  var post = postprocessors || {
    'SINGLE': [],
    'MANY': []
  };
  this.builder.defineGetSingle(name, collection, pre.SINGLE, post.SINGLE);
  this.builder.defineGetMany(name, collection, pre.MANY, post.MANY);
};

BRestful.prototype.POST = function(name, collection, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.definePost(name, collection, pre, post);
};

BRestful.prototype.PUT = function(name, collection, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.definePut(name, collection, pre, post);
};

BRestful.prototype.DELETE = function(name, collection, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.defineDelete(name, collection, pre, post);
};

module.exports = BRestful;