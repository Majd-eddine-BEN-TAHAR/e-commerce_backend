const jwt = require("jsonwebtoken");

/*eslint-env node*/
exports.generateToken = (_id) => {
  const token = jwt.sign(
    {
      _id: _id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};
