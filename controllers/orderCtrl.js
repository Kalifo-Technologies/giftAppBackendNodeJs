import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import User from "../model/User.js";
import Coupon from "../model/Coupon.js";
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);
export const createOrderCtrl = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, totalAmount,totalDiscount,deliveryFee } = req.body;
  const user = await User.findById(req.userAuthId);
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  const orderItemsArray = [];
   orderItems.forEach(async (item) => {
    try {
      orderItemsArray.push(item);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  });
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice, (uncomment for coupon)
    totalPrice: totalAmount,
    totalDiscount,
    deliveryFee
  });
  
  res.json({
    orderConfirmedDate: order.createdAt,
    deliveryAddress: order.shippingAddress,
    products: order.orderItems,
    totalAmount: totalAmount,
    deliveryFee: 40.0,
    totalDiscount: totalDiscount,
  });
});

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  console.log("===================orderId=================");
  console.log(orderId);
  console.log("====================================");

  // Validate order ID
  if (!orderId) {
    throw new Error("Please provide order ID");
  }

  try {
    const order = await Order.findById(orderId);
    console.log("=================order===================");
    console.log(order);
    console.log("====================================");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

  
    res.json({
      id:orderId,
      orderConfirmedDate: order.createdAt,
      orderShippedDate:order.createdAt,
      orderDeliveredDate:order.createdAt,
      deliveryAddress: order.shippingAddress,
      products: order.orderItems,
      totalAmount: order.totalPrice,
      deliveryFee: 40.0,
      totalDiscount: order.totalDiscount,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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

// export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
//   const id = req.params.id;
//   try {
//     const order = await Order.findById(id).populate("orderItems");
//     console.log("order:::");

//     if (!order) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });
//     }
//     const response = {
//       id: order._id,
//       orderConfirmedDate: order.createdAt,
//       orderShippedDate: order.createdAt || null,
//       orderDeliveredDate: order.createdAt || null,
//       deliveryAddress: order.shippingAddress,
//       products: order.orderItems.map((item) => ({
//         productId: item.productId,
//         totalQtyBuying: item.totalQtyBuying,
//         price: item.price,
//       })),
//       totalAmount: order.totalPrice,
//       totalDiscount:order.totalDiscount
//     };
//     console.log('====================================');
//     console.log(response);
//     console.log('====================================');

//     res.status(200).json(response);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

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
