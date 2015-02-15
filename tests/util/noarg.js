module.exports = function noarg(done) {
  return function _noarg() {
    return done();
  }
}