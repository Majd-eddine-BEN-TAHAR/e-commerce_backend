const router = require("express").Router();

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("./../middlewares/is-admin");

const { updateOrder } = require("./../controllers/admin");

const {
  placeOrder,
  getOrders,
  getOrderById,
} = require("./../controllers/order");

const {
  placeOrderValidationRules,
  getOrderByIdValidationRules,
  updateOrderValidationRules,
  validateOrder,
} = require("./../validation/orderValidation");

router.get("/", isAuth, getOrders);

router.post(
  "/",
  isAuth,
  placeOrderValidationRules(),
  validateOrder,
  placeOrder
);

router.get(
  "/:orderId",
  isAuth,
  getOrderByIdValidationRules(),
  validateOrder,
  getOrderById
);

router.put(
  "/:orderId",
  isAuth,
  isAdmin,
  updateOrderValidationRules(),
  validateOrder,
  updateOrder
);

module.exports = router;