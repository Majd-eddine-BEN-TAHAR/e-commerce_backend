const { body, validationResult, param } = require("express-validator");
const customError = require("http-errors");
const validator = require("validator");
const { ObjectId } = require("mongoose").Types;

const registerValidationRules = () => {
  return [
    body("name")
      .isLength({ min: 2 })
      .withMessage("invalid name, minimum length 2")
      .bail()
      .isAlpha()
      .withMessage("invalid name, use only alphabetic letters"),
    body("email").normalizeEmail().isEmail().withMessage("invalid email"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("invalid password, minimum length 4"),
  ];
};

const loginValidationRules = () => {
  return [
    body("email").normalizeEmail().isEmail().withMessage("invalid email"),
    body("password").isLength({ min: 4 }).withMessage("invalid password"),
  ];
};

const updatePasswordValidationRules = () => {
  return [
    body("password")
      .isLength({ min: 8 })
      .withMessage("invalid password, minimum length 4"),
    body("confirmPassword")
      .isLength({ min: 8 })
      .withMessage("invalid confirm password value, minimum length 4")
      .bail()
      .custom((confirmPassword, { req }) => {
        if (confirmPassword !== req.body.password)
          throw customError(422, "Passwords don't match");
        return true;
      }),
  ];
};

const resetPasswordValidationRules = () => {
  return [
    body("email").normalizeEmail().isEmail().withMessage("invalid email"),
  ];
};

const updateProfileValidationRules = () => {
  return [
    body("email").custom((email) => {
      if (email.length === 0) return true;
      else if (validator.isEmail(email)) return true;
      else throw customError(422, "invalid email");
    }),
  ];
};

const updateUserValidationRules = () => {
  return [
    param("userId").custom((userId) => {
      if (!ObjectId.isValid(userId))
        throw customError(404, "invalid userId _id");
      return true;
    }),
    body("role").custom((role) => {
      if (role !== "admin" && role !== "user")
        throw customError(404, "role should be admin or user");
      return true;
    }),
  ];
};

const getUserValidationRules = () => {
  return [
    param("userId").custom((userId) => {
      if (!ObjectId.isValid(userId)) throw customError(404, "invalid user _id");
      return true;
    }),
  ];
};

const deleteUserValidationRules = () => {
  return [
    param("userId").custom((userId) => {
      if (!ObjectId.isValid(userId)) throw customError(404, "invalid user _id");
      return true;
    }),
  ];
};

const validateUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const data = errors.errors.map(({ msg, param }) => ({ msg, param }));
    throw customError(422, `invalid ${data[0].param}`, { data });
  }

  next();
};

module.exports = {
  registerValidationRules,
  loginValidationRules,
  updatePasswordValidationRules,
  resetPasswordValidationRules,
  updateProfileValidationRules,
  updateUserValidationRules,
  getUserValidationRules,
  deleteUserValidationRules,
  validateUser,
};
