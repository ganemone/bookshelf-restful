var bookshelf = require('../shared').bookshelf;

var User = module.exports = bookshelf.Model.extend({
  'tableName': 'users'
});

