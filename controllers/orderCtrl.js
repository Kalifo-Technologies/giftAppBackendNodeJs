import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Coupon from "../model/Coupon.js";
//@desc create orders
//@route POST /api/v1/orders
//@access private

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

// export const createOrderCtrl = asyncHandler(async (req, res) => {
//   console.log("====================================");
//   console.log("entered");
//   console.log("====================================");
//   // //get teh coupon
//   // const { coupon } = req?.query;

//   // const couponFound = await Coupon.findOne({
//   //   code: coupon?.toUpperCase(),
//   // });
//   // if (couponFound?.isExpired) {
//   //   throw new Error("Coupon has expired");
//   // }
//   // if (!couponFound) {
//   //   throw new Error("Coupon does exists");
//   // }

//   //get discount
//   // const discount = couponFound?.discount / 100;

//   //Get the payload(customer, orderItems, shipppingAddress, totalPrice);
//   const { orderItems, shippingAddress, totalPrice } = req.body;
//   //Find the user
//   const user = await User.findById(req.userAuthId);
//   //Check if user has shipping address
//   if (!user?.hasShippingAddress) {
//     throw new Error("Please provide shipping address");
//   }
//   //Check if order is not empty
//   if (orderItems?.length <= 0) {
//     throw new Error("No Order Items");
//   }
//   //Place/create order - save into DB
//   const order = await Order.create({
//     user: user?._id,
//     orderItems,
//     shippingAddress,
//     // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
//     totalPrice,
//   });
//   let productIds = orderItems.productId;
//   //Update the product qty
//   const products = await Product.find({ _id: { $in: productIds } });

//   orderItems?.map(async (order) => {
//     const product = products?.find((product) => {
//       return product?._id?.toString() === order?._id?.toString();
//     });
//     if (product) {
//       product.totalSold += order.qty;
//     }
//     await product.save();
//   });
//   //push order into user
//   user.orders.push(order?._id);
//   await user.save();
// });

export const createOrderCtrl = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress } = req.body;

  const user = await User.findById(req.userAuthId);
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  const orderItemsArray = [];
  let totalAmount = 0;
  let totalDiscount = 0;

  orderItems.forEach(async (item) => {
    try {
      orderItemsArray.push(item);
      console.log("item============", item.totalQtyBuying);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  });

  try {
    for (const item of orderItems) {
      // console.log("iiitems=====", item);
      const product = await Product.findById(item.productId);

      // Calculate discounted price per item
      // const discountedPrice = product.price - product.discount || 0 *totalQtyBuying;
      const discountedPrice =
        (product.price - product.discount || 0) * item.totalQtyBuying;

      // Apply discount to total amount
      totalAmount += discountedPrice * (item.totalQtyBuying || 0);

      // Update total discount (optional, if needed for separate tracking)
      totalDiscount += product.discount * (item.totalQtyBuying || 0);

      console.log("discountedPrice===", totalDiscount);
    }
    console.log("total============", totalAmount);
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice, (uncomment for coupon)
    totalAmount,
    totalDiscount,
  });

  const productIds = orderItems.map((item) => item._id);

  const products = await Product.find({ _id: { $in: productIds } });

  orderItems?.map(async (orderItem) => {
    const product = products?.find(
      (product) => product?._id?.toString() === orderItem._id?.toString()
    );
    if (product) {
      product.totalSold += orderItem.qty;
      await product.save();
    } else {
      console.error("Product not found for order item:", orderItem._id);
    }
  });
  user.orders.push(order?._id);
  await user.save();
  // console.log('===============orders=====================');
  // console.log(order);
  // console.log('====================================');

  res.json({
    message: "Order created successfully!",
    deliveryAddress: order.shippingAddress,
    products: order.orderItems,
    totalAmount: order.totalPrice,
    orderConfirmedDate: order.createdAt,
    deliveryFee: 40.0

  });
});

export const getAllordersUserCtrl = asyncHandler(async (req, res) => {
  const userId = req.userAuthId;
  const orders = await Order.find({ user: userId }).populate("user");
  if (!orders) {
    return res.status(404).json({ success: false, message: "No orders found" });
  }
  const listOfOrders = [];
  orders.forEach((order) => {
    listOfOrders.push(order._id);
  });
  res.json({
    success: true,
    message: "fetched orders successfully",
    allOrders: listOfOrders,
    // orders,
  });
});

//@desc get all orders FOR ADMIN SIDE
//@route GET /api/v1/orders
//@access private

export const getAllordersCtrl = asyncHandler(async (req, res) => {
  //find all orders
  const orders = await Order.find().populate("user");
  res.json({
    success: true,
    message: "All orders",
    orders,
  });
});

//@desc get single order
//@route GET /api/v1/orders/:id

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id).populate("orderItems");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const response = {
      id: order._id,
      orderConfirmedDate: order.createdAt,
      orderShippedDate: order.createdAt || null,
      orderDeliveredDate: order.createdAt || null,
      deliveryAddress: order.shippingAddress,
      products: order.orderItems.map((item) => ({
        productId: item.productId,
        totalQtyBuying: item.totalQtyBuying,
        price: item.price,
      })),
      totalAmount: order.totalPrice,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

//@desc update order to delivered
//@route PUT /api/v1/orders/update/:id
//@access private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Order updated",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSale: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSale: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);
  //send response
  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
