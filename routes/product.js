const router = require("express").Router();

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("./../middlewares/is-admin");
const upload = require("./../middlewares/multerStorage");

const {
  getCarouselProducts,
  getProducts,
  getProductById,
  addReview,
} = require("../controllers/product");

const {
  addProduct,
  updateProduct,
  deleteProduct,
  deleteCarouselProduct,
  addCarouselProduct,
} = require("../controllers/admin");

const {
  addReviewValidationRules,
  deleteProductValidationRules,
  getProductValidationRules,
  addProductValidationRules,
  updateProductValidationRules,
  productNameValidation,
  fileValidation,
  productNameExistValidation,
  validateProduct,
} = require("./../validation/productValidation");

router.get("/carousel", getCarouselProducts);

router.post(
  "/carousel",
  isAuth,
  isAdmin,
  upload.single("image"),
  addCarouselProduct
);

router.delete("/carousel/:carouselImageId", deleteCarouselProduct);

router.get("/", getProducts);

router.post(
  "/",
  isAuth,
  isAdmin,
  upload.any(),
  addProductValidationRules(),
  validateProduct,
  fileValidation,
  productNameValidation,
  addProduct
);

router.get(
  "/:productId",
  getProductValidationRules(),
  validateProduct,
  getProductById
);

router.put(
  "/:productId",
  isAuth,
  isAdmin,
  upload.any(),
  updateProductValidationRules(),
  validateProduct,
  productNameExistValidation,
  updateProduct
);

router.delete(
  "/:productId",
  isAuth,
  isAdmin,
  deleteProductValidationRules(),
  validateProduct,
  deleteProduct
);

router.put(
  "/:productId/review",
  isAuth,
  addReviewValidationRules(),
  validateProduct,
  addReview
);

module.exports = router;
