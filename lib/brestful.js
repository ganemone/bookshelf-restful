var RestBuilder = require('./rest-builder.js');

function BRestful(app, bookshelf) {
  this.app = app;
  this.db = bookshelf;
  this.builder = new RestBuilder(app);
}

BRestful.prototype.createAPI = function (model, methods, preprocessors, postprocessors) {
  methods.forEach(function(method) {
    if (typeof this[method] === 'function') {
      var pre = preprocessors[method] || [];
      var post = postprocessors[method] || [];
      return this[method].call(this, model, pre, post);
    }
    throw 'HTTP Method: ' + method + ' is either invalid or unsupported';
  }).bind(this);
};

BRestful.prototype.GET = function(model, preprocessors, postprocessors) {
  this.builder.defineGetSingle(model, preprocessors.SINGLE, postprocessors.SINGLE);
  this.builder.defineGetMany(model, preprocessors.MANY, postprocessors.MANY);
};

BRestful.prototype.POST = function(model, preprocessors, postprocessors) {
  this.builder.definePost(model, preprocessors, postprocessors);
};

BRestful.prototype.PUT = function(model, preprocessors, postprocessors) {
  this.builder.definePut(model, preprocessors, postprocessors);
};

BRestful.prototype.DELETE = function(model, preprocessors, postprocessors) {
  this.builder.defineDelete(model, preprocessors, postprocessors);
};

module.exports = BRestful;