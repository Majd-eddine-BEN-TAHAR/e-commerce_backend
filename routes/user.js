const router = require("express").Router();

const isAuth = require("../middlewares/is-auth");
const isAdmin = require("../middlewares/is-admin");

const {
  getUsers,
  updateUserRole,
  getUserById,
  deleteUser,
} = require("../controllers/admin");

const {
  signup,
  login,
  resetPassword,
  updatePassword,
  getProfile,
  updateProfile,
} = require("../controllers/user");

const {
  updateUserValidationRules,
  registerValidationRules,
  loginValidationRules,
  updatePasswordValidationRules,
  resetPasswordValidationRules,
  updateProfileValidationRules,
  getUserValidationRules,
  deleteUserValidationRules,
  validateUser,
} = require("../validation/userValidation");

router.get("/", isAuth, isAdmin, getUsers);

router.post("/signup", registerValidationRules(), validateUser, signup);

router.post("/login", loginValidationRules(), validateUser, login);

router.get("/profile", isAuth, getProfile);

router.put(
  "/profile",
  isAuth,
  updateProfileValidationRules(),
  validateUser,
  updateProfile
);

router.post(
  "/reset",
  resetPasswordValidationRules(),
  validateUser,
  resetPassword
);

router.put(
  "/reset/:resetToken",
  updatePasswordValidationRules(),
  validateUser,
  updatePassword
);

router.get(
  "/:userId",
  isAuth,
  isAdmin,
  getUserValidationRules(),
  validateUser,
  getUserById
);

router.put(
  "/:userId",
  isAuth,
  isAdmin,
  updateUserValidationRules(),
  validateUser,
  updateUserRole
);

router.delete(
  "/:userId",
  isAuth,
  isAdmin,
  deleteUserValidationRules(),
  validateUser,
  deleteUser
);

module.exports = router;
