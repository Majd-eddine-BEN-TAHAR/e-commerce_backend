const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const orderSchema = new Schema(
  {
    products: [
      {
        product: { type: Object, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    userId: {
      type: ObjectId,
      required: true,
      ref: "User",
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    delivered: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
      required: true,
    },
    paid: {
      type: String,
      enum: ["yes", "no"],
      default: "no",
    },
    payment_method: {
      type: String,
      enum: ["PayPal", "Cash"],
      required: true,
    },
    shipping_address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
