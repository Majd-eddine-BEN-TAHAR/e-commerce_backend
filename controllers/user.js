const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const customError = require("http-errors");

const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const { sendEmail } = require("../utils/sendEmail");

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const result = await User.findOne({ email: email });
  if (result) throw customError(409, "email already exists");

  const _user = await User.create({ name, email, password });

  res.status(201).json({
    status: 200,
    _id: _user._id,
    name: _user.name,
    email: _user.email,
    role: _user.role,
    token: generateToken(_user._id),
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const _user = await User.findOne({ email: email });
  if (!_user) throw customError(422, `Please enter a valid email address.`);

  const match = await _user.validatePassword(password);
  if (!match) throw customError(422, `Wrong password`);

  res.status(200).json({
    _id: _user._id,
    status: 200,
    name: _user.name,
    email: _user.email,
    role: _user.role,
    token: generateToken(_user._id),
  });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const _user = await User.findOne({ email: email });
  if (!_user) throw customError(422, `invalid email address`);

  // ! frontend will create a route for reset with this token
  // ! make sure to change the url when you deploy because it's localhost:3000
  const resetToken = crypto.randomBytes(32).toString("hex");
  const ONE_HOUR = 60 * 60 * 1000;
  const resetTokenExpiration = new Date().getTime() + ONE_HOUR;
  _user.resetToken = resetToken;
  _user.resetTokenExpiration = resetTokenExpiration;

  _user.save((err) => {
    if (err) throw customError(500, "Internal Server Error");
    sendEmail(resetToken, email);

    res.status(200).json({
      message: `success, check your email inbox or try again in few seconds.`,
    });
  });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const resetToken = req.params.resetToken;
  const { password } = req.body;

  const _user = await User.findOne({ resetToken: resetToken });
  if (
    !_user ||
    _user.resetTokenExpiration.getTime() - new Date().getTime() <= 0
  )
    throw customError(404, "invalid token for password resetting");

  _user.password = password;
  _user.resetToken = undefined;
  _user.resetTokenExpiration = undefined;
  _user.save((err) => {
    if (err) throw customError(500, "Internal Server Error");
    res.json({ success: "success" });
  });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const _user = await User.findOne({ _id: req.user._id }).select(
    "role _id name email"
  );
  if (!_user) customError(404, "User Not found");

  res.status(200).json({ profile: _user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const _user = await User.findOne({ _id: req.user._id });
  if (!_user) throw customError(404, "User Not found");

  const { name, email, password } = req.body;

  if (_user.email !== email && email.length !== 0) {
    const emailExist = await User.findOne({ email: email });
    if (emailExist)
      throw customError(422, "email already in use, try another one");
  }

  _user.name = name || _user.name;
  _user.email = email || _user.email;
  _user.password = password || _user.password;

  _user.save((err, result) => {
    if (err) throw customError(500, "Internal Server Error");

    const { name, role, email, _id } = result;
    res.status(200).json({ profile: { name, role, email, _id } });
  });
});

// await User.create({
//   firstName: "majd",
//   lastName: "tahar",
//   password: "MAJDMAJD1",
//   email: email,
// });

// const _user = await User.create({
//   firstName,
//   lastName,
//   email,
//   password,
//   username: Math.random().toString(),
// });
// result = await _user.save();
// console.log("-------------------");
// console.log(result);
// res.status(400);
// throw new Error("duplicate email");
