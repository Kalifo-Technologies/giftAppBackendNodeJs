import expressAsyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Cart from "../model/Cart.js";
export const getAllCarts = expressAsyncHandler(async (req, res) => {
  try {
    const userId = req.userAuthId;
    const carts = await Cart.find({ user: userId });

    const formattedCarts = carts.reduce((acc, cart) => {
      acc.push(...cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        _id: item._id,
      })));
      return acc;
    }, []);

    res.status(200).json({
      status: "success",
      message: "Carts retrieved successfully",
      carts: formattedCarts,
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
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity: quantity,
      });
    }

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Item added to cart successfully",
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

    cart.items.splice(existingItemIndex, 1);

    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Item removed from cart successfully",
      // cart,
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
