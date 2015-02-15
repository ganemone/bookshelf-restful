var RestBuilder = require('./rest-builder.js');

function BRestful(app, bookshelf) {
  this.app = app;
  this.db = bookshelf;
  this.builder = new RestBuilder(app);
}

BRestful.prototype.createAPI = function (model, methods, preprocessors, postprocessors) {
  var self = this;
  var pre = preprocessors || {};
  var post = postprocessors || {};
  methods.forEach(function(method) {
    if (typeof self[method] === 'function') {
      var _pre = pre[method];

      return self[method].call(
        self,
        model,
        pre[method],
        post[method]
      );
    }
    throw 'HTTP Method: ' + method + ' is either invalid or unsupported';
  });
};

BRestful.prototype.GET = function(model, preprocessors, postprocessors) {
  var pre = preprocessors || {
    'SINGLE': [],
    'MANY': []
  };
  var post = postprocessors || {
    'SINGLE': [],
    'MANY': []
  };
  this.builder.defineGetSingle(model, pre.SINGLE, post.SINGLE);
  this.builder.defineGetMany(model, pre.MANY, post.MANY);
};

BRestful.prototype.POST = function(model, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.definePost(model, pre, post);
};

BRestful.prototype.PUT = function(model, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.definePut(model, pre, post);
};

BRestful.prototype.DELETE = function(model, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.defineDelete(model, pre, post);
};

module.exports = BRestful;