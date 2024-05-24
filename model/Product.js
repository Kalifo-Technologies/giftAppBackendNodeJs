import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [
      {
        type: String,
        default: "https://picsum.photos/200/300",
        required: true,
      },
    ],
    mainImage: {
      type: String,
      default: "https://picsum.photos/200/300",
      required: true,
    },
    reviews: [
      {
        type: String,
        required: true,
      },
    ],
    price: {
      type: Number,
      required: false,
    },
    originalPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: false,
    },
    details: {
      type: String,
      required: true,
    },
    starPoints: {
      type: Number,
      required: true,
    },
    totalQty: {
      type: Number,
      required: true,
    },
    totalSold: {
      type: Number,
      required: true,
      default: 0,
    },
    allRatings: {
      type: Number,
      required: true,
    },
    customerRatings: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

ProductSchema.virtual("qtyLeft").get(function () {
  return this.totalQty - this.totalSold;
});

ProductSchema.virtual("totalReviews").get(function () {
  return this.reviews.length;
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
