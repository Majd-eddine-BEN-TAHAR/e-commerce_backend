const customError = require("http-errors");
const asyncHandler = require("express-async-handler");

const Order = require("./../models/Order");
const Product = require("./../models/Product");

exports.placeOrder = asyncHandler(async (req, res) => {
  const { products, payment_method, shipping_address } = req.body;
  if (products.length === 0)
    throw customError(422, `you can't place an order without any items`);

  const ids = products.map((product) => product._id);
  const records = await Product.find({ _id: { $in: ids } }).select(
    "_id price name image_url"
  );

  const totalAmount = products
    .map((product) => ({
      _id: product._id,
      price: records.find((record) => record._id == product._id).price,
      quantity: +product.quantity,
    }))
    .reduce((acc, curr) => acc + curr.quantity * curr.price, 0);

  const orderProducts = products.map((_product) => ({
    product: records.find((record) => record._id == _product._id),
    quantity: _product.quantity,
  }));

  const _order = await Order.create({
    userId: req.user._id,
    products: orderProducts,
    totalAmount: totalAmount.toFixed(2),
    payment_method: payment_method,
    shipping_address: shipping_address,
  });

  res
    .status(201)
    .json({ status: 201, message: "order placed successfully!", _order });
});

exports.getOrders = asyncHandler(async (req, res) => {
  const _orders = await Order.find({ userId: req.user._id }) //
    .select("_id products totalAmount delivered paid createdAt");

  res.status(200).json({ status: 200, _orders });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const _order = await Order.findOne({
    _id: orderId,
  }).select(" -updatedAt -__v ");

  if (
    _order.userId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    throw customError(403, "Not authorized,admin resources");

  res.status(200).json({ _order });
});
