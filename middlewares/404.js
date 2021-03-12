const customError = require("http-errors");

module.exports = (req, res, next) => {
  throw customError(404, `Not Found - ${req.originalUrl}`);
};
