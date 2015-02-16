var restify = require('restify');
var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'brestful_test',
    charset  : 'utf8'
  }
});
var bookshelf = require('bookshelf')(knex);

exports.bookshelf = bookshelf;
exports.knex = knex;
var createServer = exports.createServer = function createServer() {
  return restify.createServer({
    name: 'TestApp'
  });
};
var createClient = exports.createClient = function createClient() {
  return restify.createJSONClient({
    url: 'http://localhost:8080'
  });
};
exports.server = createServer();
exports.client = createClient();