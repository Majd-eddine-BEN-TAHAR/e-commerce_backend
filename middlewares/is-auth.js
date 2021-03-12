const asyncHandler = require("express-async-handler");
const customError = require("http-errors");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/*eslint-env node*/
const isAuth = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) throw customError(401, "Not authenticated!");

  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      throw customError(401, `Not authorized ,${err.message}`);
    }
    return decoded;
  });

  req.user = await User.findOne({ _id: decoded._id });
  if (!req.user) throw customError(500, "Internal Server Error");

  next();
});

module.exports = isAuth;
