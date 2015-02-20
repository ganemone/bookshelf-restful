var bookshelf = require('../shared').bookshelf;

var User = bookshelf.Model.extend({
  'tableName': 'users'
});

var UserCollection = bookshelf.Collection.extend({
  model: User,
});

UserCollection.tableName = 'users';

module.exports = UserCollection;

