import expressAsyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Cart from "../model/Cart.js";

export const getAllCarts = expressAsyncHandler(async (req, res) => {
  try {
    console.log("entered ===================");
    // Find all carts
    const carts = await Cart.find();

    // If no carts found, return a 404 status code with an appropriate message
    if (!carts || carts.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No carts found",
      });
    }

    // Return the carts in the response
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

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Check if the user has an existing cart or create a new one
    let cart = await Cart.findOne({ user: req.userAuthId });
    if (!cart) {
      cart = new Cart({
        user: req.userAuthId,
        items: [],
      });
    }

    // Check if the item already exists in the cart
    const existingItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingItemIndex !== -1) {
      // If the item exists, update its quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // If the item does not exist, add it to the cart
      cart.items.push({
        product: productId,
        quantity: quantity,
      });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Item added to cart successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    // Check if the error is a validation error or a server error
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

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ user: req.userAuthId });
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found for the user",
      });
    }

    // Find the index of the item in the cart
    const existingItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );
    if (existingItemIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "Product is not in the cart",
      });
    }

    // Remove the item from the cart
    cart.items.splice(existingItemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.error(error);

    // Check if the error is a validation error or a server error
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


