import expressAsyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import WishList from "../model/Wishlist.js";
export const getUserWishlists = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.userAuthId;

    const wishlists = await WishList.find({ user: userId });

    if (!wishlists || wishlists.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "WishList is empty",
      });
    }

    const formattedWishlists = wishlists.map(wishlist => ({
      // _id: wishlist._id,
      user: wishlist.user,
      items: wishlist.items.map(item => ({
        product: item.product,

        // _id: item._id,
      })),
      // __v: wishlist.__v,
    }));

    res.status(200).json({
      status: "success",
      message: "WishList retrieved successfully",
      wishlists: formattedWishlists,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export const addToWishList = expressAsyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = req.body.quantity || 1;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    let wishlist = await WishList.findOne({ user: req.userAuthId });
    if (!wishlist) {
      wishlist = new WishList({
        user: req.userAuthId,
        items: [],
      });
    }

    const existingItemIndex = wishlist.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingItemIndex !== -1) {
      return res.status(400).json({
        status: "error",
        message: "Product already exists in wishlist",
      });
    }

    wishlist.items.push({ product: productId, quantity });

    await wishlist.save();

    res.status(200).json({
      status: "success",
      message: "Item added to wishlist successfully",
      // wishlist,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
});

export const removeFromWishList = expressAsyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    let wishList = await WishList.findOne({ user: req.userAuthId });
    if (!wishList) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found for the user",
      });
    }

    const existingItemIndex = wishList.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingItemIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product is not in the wishList",
      });
    }

    wishList.items.splice(existingItemIndex, 1);

    await wishList.save();

    res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully",
      wishList,
    });
  } catch (error) {
    console.error(error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
});
