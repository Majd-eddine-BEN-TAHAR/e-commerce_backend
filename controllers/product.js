const customError = require("http-errors");
const CarouselImage = require("../models/CarouselImage");
const Product = require("./../models/Product");
const asyncHandler = require("express-async-handler");

// all products or by name
exports.getProducts = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword || "";
  const regex = new RegExp(keyword, "i");

  const _products = await Product.find({ name: { $regex: regex } }).select(
    "-__v"
  );
  res.status(200).json({ _products });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // const _product = await Product.findOne({ _id: productId }).select("-__v");
  const _product = await Product.findOne({ _id: productId }).populate({
    path: "reviews.userId",
    select: "name",
  });

  if (!_product) throw customError(404, "Product not found");

  res.status(200).json({ product: _product });
});

exports.getCarouselProducts = asyncHandler(async (req, res) => {
  const _products = await CarouselImage.find().select("-__v");
  res.status(200).json({ status: 200, _products });
});

exports.addReview = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { comment, rating } = req.body;
  const _product = await Product.findOne({ _id: productId });
  if (!_product) throw customError(404, "Product not found");

  _product.generalRating =
    (_product.generalRating * _product.reviews.length + +rating) /
    (_product.reviews.length + 1).toFixed(1);
  _product.reviews.push({
    userId: req.user._id,
    rating: +rating,
    comment: comment,
  });

  _product.save((err) => {
    if (err) throw customError(500, "Internal Server Error");
    res.status(200).json({ message: "review added successfully" });
  });
});
