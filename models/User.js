const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 2,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      // index: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    contactNumber: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    resetToken: {
      type: String,
    },
    resetTokenExpiration: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function save(next) {
  // only hash the password if it has been modified or it's new
  if (this.isModified("password")) {
    try {
      const hasshed_password = await bcrypt.hash(this.password, 10);
      this.password = hasshed_password;
      return next();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

userSchema.methods.validatePassword = function validatePassword(password) {
  // async await in auth controller
  return bcrypt.compare(password, this.password);
};

module.exports = model("User", userSchema);
