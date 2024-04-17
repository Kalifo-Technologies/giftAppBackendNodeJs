import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin

// required this.mainImage,
// required this.subImages,
// required this.giftName,==
// required this.description,==
// required this.originalPrice,
// required this.price,==
// required this.discount,
// required this.ratings,
// required this.starPoints,
// required this.sizes,==
// required this.selectedSize,
// required this.details,
// // required this.categories,==
// // required this.specifiedFor,
// // required this.isInCart,
// // required this.isInWishlist,
// required this.quantity,
export const createProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    price,
    totalQty,
    brand,
    originalPrice,
    discount,
    details,
    starPoints,
  } = req.body;
  console.log(req.body);
  const convertedImgs = req.files?.map((file) => file?.path);
  console.log('====================================');
  console.log(convertedImgs);
  console.log('====================================');
  //Product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }
  //find the brand
  const brandFound = await Brand.findOne({
    name: "addidas",
  });

  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }
  //find the category
  // const categoryFound = await Category.findOne({
  //   name: category,
  // });
  // if (!categoryFound) {
  //   throw new Error(
  //     "Category not found, please create category first or check category name"
  //   );
  // }
  //create the product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
    originalPrice,
    discount,
    details,
    starPoints,
  });
  // console.log('====================================');
  // console.log("product from post request",product);
  // console.log('====================================');
  //push the product into category
  // categoryFound.products.push(product._id);
  //resave
  // await categoryFound.save();
  //push the product into brand
  brandFound.products.push(product._id);
  //resave
  await brandFound.save();
  //send response
  res.json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public

// export const getProductsCtrl = asyncHandler(async (req, res) => {
//   console.log(req.query);
//   //query
//   let productQuery = Product.find();

//   //search by name
//   if (req.query.name) {
//     productQuery = productQuery.find({
//       name: { $regex: req.query.name, $options: "i" },
//     });
//   }

//   //filter by brand
//   if (req.query.brand) {
//     productQuery = productQuery.find({
//       brand: { $regex: req.query.brand, $options: "i" },
//     });
//   }

//   //filter by category
//   if (req.query.category) {
//     productQuery = productQuery.find({
//       category: { $regex: req.query.category, $options: "i" },
//     });
//   }

//   //filter by color
//   if (req.query.color) {
//     productQuery = productQuery.find({
//       colors: { $regex: req.query.color, $options: "i" },
//     });
//   }

//   //filter by size
//   if (req.query.size) {
//     productQuery = productQuery.find({
//       sizes: { $regex: req.query.size, $options: "i" },
//     });
//   }
//   //filter by price range
//   if (req.query.price) {
//     const priceRange = req.query.price.split("-");
//     //gte: greater or equal
//     //lte: less than or equal to
//     productQuery = productQuery.find({
//       price: { $gte: priceRange[0], $lte: priceRange[1] },
//     });
//   }
//   //pagination
//   //page
//   const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
//   //limit
//   const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
//   //startIdx
//   const startIndex = (page - 1) * limit;
//   //endIdx
//   const endIndex = page * limit;
//   //total
//   const total = await Product.countDocuments();

//   productQuery = productQuery.skip(startIndex).limit(limit);

//   //pagination results
//   const pagination = {};
//   if (endIndex < total) {
//     pagination.next = {
//       page: page + 1,
//       limit,
//     };
//   }
//   if (startIndex > 0) {
//     pagination.prev = {
//       page: page - 1,
//       limit,
//     };
//   }

//   //await the query
//   const products = await productQuery.populate("reviews");
//   console.log('====================================');
//   console.log(products);
//   console.log('====================================');;
//   res.json({
//     status: "success",
//     total,
//     results: products.length,
//     pagination,
//     message: "Products fetched successfully",
//     products,
//   });
// });

export const getProductsCtrl = asyncHandler(async (req, res) => {
  // console.log(req.query);
  //query
  let productQuery = Product.find();
  // console.log('=============product query=======================');
  // console.log();
  // console.log('====================================');

  //search by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  //filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }
  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }
  //pagination
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  const products = await productQuery
    .populate("reviews")
    .select(
      "name description brand sizes colors images reviews price originalPrice discount details starPoints totalQty totalSold totalReviews averageRating"
    );

  // console.log('====================================');
  // console.log(products);
  // console.log('====================================');

  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductCtrl = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "fullname",
      },
    });
    if (!product) {
      res.status(404).json({
        status: "error",
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      status: "success",
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// @desc    update  product
// @route   PUT /api/products/:id/update
// @access  Private/Admin

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;
  //validation

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

// @desc    delete  product
// @route   DELETE /api/products/:id/delete
// @access  Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
