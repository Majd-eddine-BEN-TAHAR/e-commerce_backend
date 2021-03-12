const { body, validationResult, param } = require("express-validator");
const customError = require("http-errors");
const { ObjectId } = require("mongoose").Types;

const placeOrderValidationRules = () => {
  return [
    body("products").custom((products) => {
      const ids = products.map((product) => product._id);

      const validObjectIds = ids.every((_id) => ObjectId.isValid(_id));
      if (!validObjectIds) throw customError(404, "invalid product _id");

      return true;
    }),
    body("payment_method").custom((value) => {
      if (!["Cash", "PayPal"].includes(value))
        throw customError(422, "Choose a valid payment_method");
      return true;
    }),

    body("shipping_address").custom((value) => {
      if (!value.match(/^[A-Za-z0-9 ]+$/))
        throw customError(
          422,
          "shipping address must contains only letters and numbers and spaces"
        );
      return true;
    }),
  ];
};

const getOrderByIdValidationRules = () => {
  return [
    param("orderId").custom((orderId) => {
      if (!ObjectId.isValid(orderId))
        throw customError(404, "invalid order _id");
      return true;
    }),
  ];
};

const updateOrderValidationRules = () => {
  return [
    param("orderId").custom((orderId) => {
      if (!ObjectId.isValid(orderId))
        throw customError(404, "invalid order _id");
      return true;
    }),
    body("delivered").custom((delivered) => {
      if (delivered !== "yes" && delivered !== "no")
        throw customError(404, "delivered should be a string with yes or no");
      return true;
    }),
  ];
};

const validateOrder = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const data = errors.errors.map(({ msg, param }) => ({
      msg,
      param,
    }));
    console.log(errors);
    throw customError(422, `invalid ${data[0].param}`, { data });
  }

  next();
};

module.exports = {
  placeOrderValidationRules,
  getOrderByIdValidationRules,
  updateOrderValidationRules,
  validateOrder,
};
