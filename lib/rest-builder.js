var db = require('./db');
var sendJSON = require('./util/sendJSON');

// Constructor for RestBuilder
function RestBuilder(app) {
  this.app = app;
}

RestBuilder.prototype.defineGetSingle = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name +  '/:id';
  var handlers = preprocessors || [];
  function _getSingle(req, res, next) {
    db.get(model, req.params.id, sendJSON(res, next));
  }
  handlers.push(_getSingle);
  this.app.get(route, handlers);
};

RestBuilder.prototype.defineGetMany = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name;
  var handlers = preprocessors || [];
  function _getMany(req, res, next) {
    db.get(model, req.params.q, sendJSON(res, next));
  }
  handlers.push(_getMany);
  this.app.get(route, handlers);
};

RestBuilder.prototype.definePost = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name;
  var handlers = preprocessors || [];
  function _post(req, res, next) {
    db.add(model, req.body, sendJSON(res, next));
  }
  handlers.push(_post);
  this.app.post(route, handlers);
};

RestBuilder.prototype.definePut = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name +  '/:id';
  var handlers = preprocessors || [];
  function _put(req, res, next) {
    db.update(model, req.params.id, req.params.q, sendJSON(res, next));
  }
  handlers.push(_put);
  this.app.put(route, handlers);
};

RestBuilder.prototype.defineDelete = function(name, model, preprocessors, postprocessors) {
  var route = '/' + name +  '/:id';
  var handlers = preprocessors || [];
  function _del(req, res, next) {
    db.delete(model, req.params.id, sendJSON(res, next));
  }
  handlers.push(_del);
  this.app.del(route, handlers);
  // TODO define deletions of relationships
};

module.exports = RestBuilder;