var resBuilder = require('./response-builder');

function get(model, params, cb) {
}

function add(model, data, cb) {
  model
    .forge(data)
    .save()
    .then(function (model) {
      return cb(null, resBuilder.get201(model));
    })
    .catch(function (error) {
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        return cb(null, resBuilder.get400({ message: error.message }));
      }
      return cb(error);
    });
}

function update(model, where, data, cb) {
}

function del(model, id, params, cb) {
}

function getNameFromCollection(model) {
  return new model().tableName;
}

exports.get = get;
exports.add = add;
exports.update = update;
exports.delete = del;
exports.getNameFromCollection = getNameFromCollection;