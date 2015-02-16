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

RestBuilder.prototype.defineGetSingle = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name + ':id';
  this.addPreprocessorsToRoute(route, 'get', preprocessors);
  this.app.get(route, function(req, res, next) {
    db.get(model, req.params, sendJSON(res, next));
  });
};

RestBuilder.prototype.defineGetMany = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name;
  this.addPreprocessorsToRoute(route, 'get', preprocessors);
  this.app.get(route, function(req, res, next) {
    db.get(model, req.params, sendJSON(res, next));
  });
};

RestBuilder.prototype.definePost = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name;
  this.addPreprocessorsToRoute(route, 'post', preprocessors);
  this.app.post(route, function(req, res, next) {
    db.add(model, req.params, sendJSON(res, next));
  });
};

// PATCH /api/person HTTP/1.1
// Host: example.com

// {
//   "age": 1,
//   "q": {"filters": [{"name": "name", "op": "like", "val": "%y%"}]}
// }
RestBuilder.prototype.definePut = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name;
  this.addPreprocessorsToRoute(route, 'put', preprocessors);
  this.app.put(route, function(req, res, next) {
    db.update(model, req.params, sendJSON(res, next));
  });
};

RestBuilder.prototype.defineDelete = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name + ':id';
  this.addPreprocessorsToRoute(route, 'del', preprocessors);
  this.app.del(route, function(req, res, next) {
    db.delete(model, req.params, sendJSON(res, next));
  });
  // TODO define deletions of relationships
};

module.exports = RestBuilder;