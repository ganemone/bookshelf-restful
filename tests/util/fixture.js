var knex = require('./shared').knex;

module.exports = function fixture(model, data) {
  before(function(done) {
    var self = this;
    model.forge(data).save().then(function(model) {
      var models = self.models || [];
      models.push(model);
      self.models = models;
      done();
    }).catch(done);
  });

  after(function(done) {
    var tableName = new model({}).tableName;
    knex(tableName).delete().then().catch(done);
  })
}