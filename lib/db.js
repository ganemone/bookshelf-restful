var resBuilder = require('./response-builder');
var Promise = require('bluebird');

function get(collection, params, cb) {
}

function add(collection, data, cb) {
  var results = collection.forge(data);
  Promise.all(results.invoke('save'))
    .then(function (collection) {
      return cb(null, resBuilder.get201(collection));
    })
    .catch(function (error) {
      if (error.code === 'ER_BAD_FIELD_ERROR') {
        return cb(null, resBuilder.get400({ message: error.message }));
      }
      return cb(error);
    });
}

function update(collection, where, data, cb) {
}

function del(collection, id, params, cb) {
}

function getNameFromCollection(collection) {
  return collection.tableName;
}

exports.get = get;
exports.add = add;
exports.update = update;
exports.delete = del;
exports.getNameFromCollection = getNameFromCollection;