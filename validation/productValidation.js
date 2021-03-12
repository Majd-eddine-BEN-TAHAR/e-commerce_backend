const { body, validationResult, param } = require("express-validator");
const customError = require("http-errors");
const path = require("path");
const asyncHandler = require("express-async-handler");
const { ObjectId } = require("mongoose").Types;

const Product = require("./../models/Product");
const deleteFile = require("./../utils/deleteFile");

const addReviewValidationRules = () => {
  return [
    body("comment")
      .isLength({ min: 2 })
      .withMessage("invalid comment, minimum length 2")
      .bail(),
    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("rating should be an integer between 0 & 5"),
  ];
};

const getProductValidationRules = () => {
  return [
    param("productId").custom((productId) => {
      if (!ObjectId.isValid(productId))
        throw customError(404, "invalid product _id");
      return true;
    }),
  ];
};

const deleteProductValidationRules = () => {
  return [
    param("productId").custom((productId) => {
      if (!ObjectId.isValid(productId))
        throw customError(404, "invalid product _id");
      return true;
    }),
  ];
};

const productNameValidation = asyncHandler(async (req, res, next) => {
  const productExists = await Product.findOne({ name: req.body.name });
  if (productExists) {
    // delete uploaded file
    deleteFile(path.join("tmp", req.files[0].filename));
    throw customError(409, "product name already in use, choose another one!");
  }

  next();
});

const fileValidation = (req, res, next) => {
  if (req.files.length == 0)
    throw customError(400, `you didn't attach any image`);

  next();
};

const addProductValidationRules = () => {
  return [
    body("name").custom((value) => {
      if (!value.match(/^[A-Za-z0-9 ]+$/))
        throw customError(
          422,
          "product name must contains only letters and numbers and spaces"
        );
      return true;
    }),
    body("price")
      .isFloat({ min: 1, max: 10000 })
      .withMessage("price should be a number between 1 and 10000!"),
    body("countInStock")
      .isInt()
      .withMessage("countInStock should be an integer"),
    body("description")
      .isLength({ min: 2, max: 200 })
      .withMessage("description length should be between 2 and 200"),
  ];
};

const updateProductValidationRules = () => {
  return [
    param("productId").custom((productId) => {
      if (!ObjectId.isValid(productId))
        throw customError(404, "invalid product _id");
      return true;
    }),
    body("name").custom((value) => {
      if (!value.match(/^[A-Za-z0-9 ]+$/))
        throw customError(
          422,
          "product name must contains only letters and numbers and spaces"
        );
      return true;
    }),
    body("price")
      .isFloat({ min: 1, max: 10000 })
      .withMessage("price should be a number between 1 and 10000!"),
    body("countInStock")
      .isInt()
      .withMessage("countInStock should be an integer"),
    body("description")
      .isLength({ min: 2, max: 200 })
      .withMessage("description length should be between 2 and 200"),
  ];
};

const productNameExistValidation = asyncHandler(async (req, res, next) => {
  const productExists = await Product.findOne({
    _id: { $ne: req.params.productId },
    name: req.body.name,
  });
  if (productExists)
    throw customError(409, "product name already in use, choose another one!");

  next();
});

const validateProduct = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    if (!errors.isEmpty()) {
      const data = errors.errors.map(({ msg, param }) => ({ msg, param }));
      throw customError(422, `invalid ${data[0].param}`, { data });
    }
  }

  next();
};

module.exports = {
  validateProduct,
  addReviewValidationRules,
  getProductValidationRules,
  deleteProductValidationRules,
  productNameValidation,
  fileValidation,
  addProductValidationRules,
  updateProductValidationRules,
  productNameExistValidation,
};
