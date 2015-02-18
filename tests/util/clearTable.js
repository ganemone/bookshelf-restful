var knex = require('./shared').knex;
var noarg = require('./noarg');

module.exports = function(tableName) {
  after(function(done) {
    knex(tableName)
      .delete()
      .then(noarg(done))
      .catch(done);
  });
}