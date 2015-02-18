
function get(model, params, cb) {
}

function add(model, data, cb) {
  model.forge(data)
    .save()
    .then(cb)
    .catch(cb);
}

function update(model, id, data, cb) {
}

function del(model, id, params, cb) {
}

function getNameFromModel(model) {
  return new model().tableName;
}

exports.get = get;
exports.add = add;
exports.update = update;
exports.delete = del;
exports.getNameFromModel = getNameFromModel;