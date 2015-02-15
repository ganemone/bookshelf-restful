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
var server = restify.createServer({
  name: 'TestApp'
});

exports.server = server;
exports.bookshelf = bookshelf;
exports.knex = knex;