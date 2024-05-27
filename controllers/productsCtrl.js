import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
import Category from "../model/Category.js";
import Product from "../model/Product.js";
export const createMainImage = asyncHandler(async (req, res) => {
  const mainImgs = req.files?.map((file) => file?.path);
  const product = await Product.create({
    mainImages: mainImgs,
  });
  res.json({
    status: "success",
    message: "main image created successfully",
    product,
  });
});

export const createProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    reviews,
    price,
    originalPrice,
    discount,
    details,
    starPoints,
    totalQty,
    totalSold,
    allRatings,
    customerRatings,
    tags,
  } = req.body;

  const mainImage = req.files["mainImage"]
    ? req.files["mainImage"][0].path
    : null;
  const regularImages = req.files["regularImages"]
    ? req.files["regularImages"].map((file) => file.path)
    : [];

  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error("Product Already Exists");
  }

  const brandFound = await Brand.findOne({ name: "addidas" });
  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand name"
    );
  }

  const product = await Product.create({
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    reviews,
    price,
    originalPrice,
    discount,
    details,
    starPoints,
    totalQty,
    totalSold,
    allRatings,
    customerRatings,
    tags,
    user: req.userAuthId,
    images: regularImages,
    mainImage: mainImage,
  });

  brandFound.products.push(product._id);
  await brandFound.save();

  const productResponse = product.toObject();
  delete productResponse._id;
  delete productResponse.user;
  delete productResponse.mainImages;
  delete productResponse.createdAt;
  delete productResponse.updatedAt;
  delete productResponse.__v;

  productResponse.totalReviews = product.reviews.length;
  let qtyLeft = 98;
  productResponse.qtyLeft = qtyLeft;

  res.json({
    ...productResponse,
  });
});

export const getProductsCtrl = asyncHandler(async (req, res) => {
  let productQuery = Product.find();

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
      "name description brand sizes colors tags images mainImage reviews price originalPrice discount details starPoints totalQty totalSold allRatings customerRatings"
    );
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});

export const getProductCtrl = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("-createdAt -updatedAt -__v -user ")
      .populate({
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

// export const updateProductCtrl = asyncHandler(async (req, res) => {
//   const {
//     name,
//     description,
//     category,
//     sizes,
//     colors,
//     user,
//     price,
//     totalQty,
//     brand,
//     originalPrice,
//     discount,
//     details,
//     totalSold,
//     tags,
//     images,
//     mainImage,
//   } = req.body;
//   console.log('====================================');
//   console.log(req.body);
//   console.log('====================================');

//   const product = await Product.findByIdAndUpdate(
//     req.params.id,
//     {
//       name,
//       description,
//       category,
//       sizes,
//       colors,
//       user,
//       price,
//       totalQty,
//       brand,
//       originalPrice,
//       discount,
//       details,
//       totalSold,
//       tags,
//       images,
//       mainImage,
//     },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.json({
//     status: "success",
//     message: "Product updated successfully",
//     product,
//   });
// });

export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    brand,
    category,
    sizes,
    colors,
    reviews,
    price,
    originalPrice,
    discount,
    details,
    starPoints,
    totalQty,
    totalSold,
    allRatings,
    customerRatings,
    tags,
  } = req.body;

  const mainImage = req.files["mainImage"] ? req.files["mainImage"][0].path : null;
  const regularImages = req.files["regularImages"] ? req.files["regularImages"].map((file) => file.path) : [];

  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  if (name) product.name = name;
  if (description) product.description = description;
  if (brand) product.brand = brand;
  if (category) product.category = category;
  if (sizes) product.sizes = sizes;
  if (colors) product.colors = colors;
  if (reviews) product.reviews = reviews;
  if (price) product.price = price;
  if (originalPrice) product.originalPrice = originalPrice;
  if (discount) product.discount = discount;
  if (details) product.details = details;
  if (starPoints) product.starPoints = starPoints;
  if (totalQty) product.totalQty = totalQty;
  if (totalSold) product.totalSold = totalSold;
  if (allRatings) product.allRatings = allRatings;
  if (customerRatings) product.customerRatings = customerRatings;
  if (tags) product.tags = tags;
  if (mainImage) product.mainImage = mainImage;
  if (regularImages.length > 0) product.images = regularImages;

  await product.save();

  const productResponse = product.toObject();
  delete productResponse._id;
  delete productResponse.user;
  delete productResponse.mainImage;
  delete productResponse.createdAt;
  delete productResponse.updatedAt;
  delete productResponse.__v;

  productResponse.totalReviews = product.reviews.length;
  let qtyLeft = 98;
  productResponse.qtyLeft = qtyLeft;

  res.json({
    ...productResponse,
  });
});

export const deleteProductCtrl = asyncHandler(async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
