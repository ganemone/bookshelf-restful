var RestBuilder = require('./rest-builder.js');
var getNameFromModel = require('./db').getNameFromModel;

function BRestful(app, bookshelf) {
  this.app = app;
  this.db = bookshelf;
  this.builder = new RestBuilder(app);
}

BRestful.prototype.createAPI = function (model, methods, preprocessors, postprocessors) {
  var self = this;
  var pre = preprocessors || {};
  var post = postprocessors || {};
  var name = getNameFromModel(model);
  methods.forEach(function(method) {
    if (typeof self[method] === 'function') {
      var _pre = pre[method];

      return self[method].call(
        self,
        name,
        model,
        pre[method],
        post[method]
      );
    }
    throw 'HTTP Method: ' + method + ' is either invalid or unsupported';
  });
};

BRestful.prototype.GET = function(name, model, preprocessors, postprocessors) {
  var pre = preprocessors || {
    'SINGLE': [],
    'MANY': []
  };
  var post = postprocessors || {
    'SINGLE': [],
    'MANY': []
  };
  this.builder.defineGetSingle(name, model, pre.SINGLE, post.SINGLE);
  this.builder.defineGetMany(name, model, pre.MANY, post.MANY);
};

BRestful.prototype.POST = function(name, model, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.definePost(name, model, pre, post);
};

BRestful.prototype.PUT = function(name, model, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.definePut(name, model, pre, post);
};

BRestful.prototype.DELETE = function(name, model, preprocessors, postprocessors) {
  var pre = preprocessors || [];
  var post = postprocessors || [];
  this.builder.defineDelete(name, model, pre, post);
};

module.exports = BRestful;