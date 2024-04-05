import expressAsyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Cart from "../model/Cart.js";

export const getAllCarts = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.userAuthId;
    const carts = await Cart.find({ user: userId });

    // if (!carts || carts.length === 0) {
    //   return res.status(404).json({
    //     status: "error",
    //     message: "Cart is empty",
    //   });
    // }
    console.log('====================================');
    console.log(carts);
    console.log('====================================');

    res.status(200).json({
      status: "success",
      message: "Carts retrieved successfully",
      carts,
    });
  } catch (error) {
    console.error(error);

    // Handle any errors
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export const addToCart = expressAsyncHandler(async (req, res) => {
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

    let cart = await Cart.findOne({ user: req.userAuthId });
    if (!cart) {
      cart = new Cart({
        user: req.userAuthId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingItemIndex !== -1) {
      // If the product already exists in the cart, you might want to handle this scenario
      return res.status(400).json({
        status: "error",
        message: "Product already exists in cart",
      });
    }

    // If the product doesn't exist in the cart, add it
    cart.items.push({
      product: productId,
      quantity: quantity,
    });

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Item added to cart successfully",
      cart,
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

export const removeFromCart = expressAsyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(req.userAuthId);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    let cart = await Cart.findOne({ user: req.userAuthId });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found for the user",
      });
    }

    const existingItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingItemIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product is not in the cart",
      });
    }

    // Remove the specific item from the cart
    cart.items.splice(existingItemIndex, 1);

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully",
      cart,
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
