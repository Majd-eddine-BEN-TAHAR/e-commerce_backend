const multer = require("multer");

// eslint-disable-next-line no-unused-vars
module.exports = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    error.status = 413;
    error.message = "image too large, max size is 1mb!";
  }

  const status = error.status || 500;
  const message = error.message;
  const data = error.data ? error.data : null;
  const method = req.method;

  const response = { status: status, error: message, data, method };
  console.log(status);
  res.status(status).json(response);
};
