//product schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProductMainImageSchema = new Schema(
  {
    mainImages: [
      {
        type: String,
        default: "https://picsum/photos/200/300",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);


const ProductMainImage = mongoose.model("ProductMainImage", ProductMainImageSchema);

export default ProductMainImage;
