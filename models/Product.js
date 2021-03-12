const { Schema, model } = require("mongoose");
const { ObjectId } = require("mongoose").Schema.Types;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    image_url: {
      type: String,
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [
      {
        userId: {
          type: ObjectId,
          required: true,
          ref: "User",
        },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
    generalRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// productSchema.virtual("rating").get(function () {
//   return "dsa";
// });

module.exports = model("Product", productSchema);
