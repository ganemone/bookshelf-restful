module.exports = function sendJSON(res, next) {
  return function _sendJSON(error, data) {
    if (error) {
      return next(error);
    }
    return res.json(data);
  }
};