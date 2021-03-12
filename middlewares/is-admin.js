const asyncHandler = require("express-async-handler");
const customError = require("http-errors");

const admin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin")
    throw customError(403, "Not Authorized, admin resources");

  next();
});

module.exports = admin;
