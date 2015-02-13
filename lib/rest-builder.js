
// Constructor for RestBuilder
function RestBuilder(app) {
  this.app = app;
}

RestBuilder.prototype.addPreprocessorsToRoute = function(route, method, preprocessors) {
  // TODO: implement .call on method to support GET, POST, PUT, and DEL
  preprocessors.forEach(function(processor) {
    this.app.get(route, processor);
  }).bind(this);
};



RestBuilder.prototype.defineGetSingle = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name + ':id';
  this.addPreprocessorsToRoute(route, 'get', preprocessors);
  this.app.get(route, function(req, res, next) {
    // RETURN GET SINGLE
    // TODO: somehow, handle postprocessors
  });
};

RestBuilder.prototype.defineGetMany = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name;
  this.addPreprocessorsToRoute(route, 'get', preprocessors);
  this.app.get(route, function(req, res, next) {
    if (req.params.length > 0) {
      // RETURN get models with search params req.params
    }
    // RETURN get all models
  });
};


RestBuilder.prototype.definePost = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name;
  this.addPreprocessorsToRoute(route, 'post', preprocessors);
  this.app.post(route, function(req, res, next) {
    // Validate req.body against model
    // Execute insert query
    // return 201
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
    // Validate param + filters against model
    // Execute UPDATE query WHERE filters match
    // Return 200 + {num_modified: (number)}
  });
};

RestBuilder.prototype.defineDelete = function(model, preprocessors, postprocessors) {
  var route = '/' + model.name + ':id';
  this.addPreprocessorsToRoute(route, 'del', preprocessors);
  this.app.del(route, function(req, res, next) {
    // Delete model based on id
  });
  // TODO define deletions of relationships
};

module.exports = RestBuilder;