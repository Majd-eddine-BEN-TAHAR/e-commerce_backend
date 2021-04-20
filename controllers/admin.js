const asyncHandler = require("express-async-handler");
const customError = require("http-errors");
const path = require("path");

const User = require("../models/User");
const Order = require("../models/Order");
const CarouselImage = require("../models/CarouselImage");
const Product = require("../models/Product");
const deleteFile = require("./../utils/deleteFile");
const moveFile = require("./../utils/moveFile");
const rootDir = require("./../utils/rootDir");

exports.getUsers = asyncHandler(async (req, res) => {
  const _users = await User.find().select("_id role name email");
  res.status(200).json({ _users, status: 200 });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const _user = await User.findOne({ _id: userId }).select(
    "-password -updatedAt"
  );

  if (!_user) throw customError(404, "user does not exit");
  res.status(200).json({ _user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const _user = await User.findOneAndDelete({
    _id: userId,
  });

  if (!_user) throw customError(404, "no such user with this _id");

  res.status(200).json({ status: 200, result: "user deleted successfully!" });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const _user = await User.findOne({ _id: userId });
  _user.role = role;

  _user.save((err) => {
    if (err) throw customError(500, "Internal Server Error");
    res.status(200).json({ status: 200, result: "role updated successfully" });
  });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const _orders = await Order.find().select("");
  res.status(200).json({ status: 200, _orders });
});

exports.updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { delivered } = req.body;

  const _order = await Order.findByIdAndUpdate(orderId, { delivered });
  if (!_order) throw customError(422, "order does not exist with this _id");

  res.status(200).json({ status: 200, result: "updated successfully" });
});

exports.addCarouselProduct = asyncHandler(async (req, res) => {
  if (!req.file) throw customError(400, `you didn't attach any image`);

  const image_name = req.file.filename;
  const oldPath = path.join(rootDir, "tmp", image_name);
  const newPath = path.join(rootDir, "uploads", image_name);
  await moveFile(oldPath, newPath);

  const _carouselImage = await CarouselImage.create({
    image_url: "uploads/" + image_name,
  });

  if (!_carouselImage) throw customError(500, "Internal Server Error");

  res.status(201).json({
    status: 201,
    message: "image added successfully",
    image_url: _carouselImage.image_url,
  });
});

exports.deleteCarouselProduct = asyncHandler(async (req, res) => {
  const { carouselImageId } = req.params;

  const _carouselImageDoc = await CarouselImage.findOneAndDelete({
    _id: carouselImageId,
  });

  if (!_carouselImageDoc) throw customError(404, "no such image with this _id");

  deleteFile(_carouselImageDoc.image_url);

  res.status(200).json({ status: 200, result: "image deleted successfully!" });
});

exports.addProduct = asyncHandler(async (req, res) => {
  const { name, price, countInStock, description } = req.body;
  const image_name = req.files[0].filename;

  const oldPath = path.join(rootDir, "tmp", image_name);
  const newPath = path.join(rootDir, "uploads", image_name);
  await moveFile(oldPath, newPath);

  const _product = await Product.create({
    name,
    price,
    countInStock,
    description,
    image_url: "uploads/" + image_name,
  });

  res.status(201).json({
    _id: _product._id,
    image_url: "uploads/" + image_name,
    message: "product created successfully",
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, price, countInStock, description } = req.body;

  const _product = await Product.findOne({ _id: productId });
  if (!_product) throw customError(404, "product does not exist");

  if (req.files.length !== 0) {
    deleteFile(_product.image_url);

    const image_name = req.files[0].filename;
    const oldPath = path.join(rootDir, "tmp", image_name);
    const newPath = path.join(rootDir, "uploads", image_name);
    await moveFile(oldPath, newPath);

    _product.image_url = "uploads/" + image_name;
  }

  _product.name = name;
  _product.price = price;
  _product.countInStock = countInStock;
  _product.description = description;

  _product.save((err) => {
    if (err) throw customError(500, "Internal Server Error");

    res
      .status(200)
      .json({ _product, message: "product updated successfully!" });
  });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const _product = await Product.findOneAndDelete({
    _id: productId,
  });

  if (!_product) throw customError(404, "no such product with this _id");

  res.status(200).json({ result: "product deleted successfully!" });
});
