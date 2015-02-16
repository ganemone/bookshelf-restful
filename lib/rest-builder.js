var db = require('./db');
var sendJSON = require('./util/sendJSON');

// Constructor for RestBuilder
function RestBuilder(app) {
  this.app = app;
}

RestBuilder.prototype.addPreprocessorsToRoute = function(route, method, preprocessors) {
  // TODO: implement .call on method to support GET, POST, PUT, and DEL
  func = this.app[method];
  preprocessors.forEach(function(processor) {
    func(route, processor);
  });
};

RestBuilder.prototype.defineGetSingle = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name + ':id';
  this.addPreprocessorsToRoute(route, 'get', preprocessors);
  this.app.get(route, function(req, res, next) {
    db.get(model, req.params.id, sendJSON(res, next));
  });
};

RestBuilder.prototype.defineGetMany = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name;
  this.addPreprocessorsToRoute(route, 'get', preprocessors);
  this.app.get(route, function(req, res, next) {
    db.get(model, req.params.q, sendJSON(res, next));
  });
};

RestBuilder.prototype.definePost = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name;
  this.addPreprocessorsToRoute(route, 'post', preprocessors);
  this.app.post(route, function(req, res, next) {
    db.add(model, req.body, sendJSON(res, next));
  });
};

RestBuilder.prototype.definePut = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name + ':id';
  this.addPreprocessorsToRoute(route, 'put', preprocessors);
  this.app.put(route, function(req, res, next) {
    db.update(model, req.params.id, req.params.q, sendJSON(res, next));
  });
};

RestBuilder.prototype.defineDelete = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name + ':id';
  this.addPreprocessorsToRoute(route, 'del', preprocessors);
  this.app.del(route, function(req, res, next) {
    db.delete(model, req.params.id, sendJSON(res, next));
  });
  // TODO define deletions of relationships
};

module.exports = RestBuilder;