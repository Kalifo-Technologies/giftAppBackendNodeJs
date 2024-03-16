import mongoose from "mongoose";
const Schema = mongoose.Schema;

const wishListItemSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const WishListSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [wishListItemSchema],
});

const WishList = mongoose.model("WishList", WishListSchema);

export default WishList;
