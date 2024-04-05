import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    //category exists
    const categoryFound = await Category.findOne({ name });
    if (categoryFound) {
      res.status(409).json({
        status: "error",
        message: "Category already exists",
        code: "CATEGORY_ALREADY_EXISTS",
      });
    } else {
      //create
      const category = await Category.create({
        name: name?.toLowerCase(),
        user: req.userAuthId,
        image: req?.file?.path,
      });

      res.json({
        status: "success",
        message: "Category created successfully",
        category,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
// export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json({
//       status: "success",
//       message: "Categories fetched successfully",
//       categories,
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: "error",
//       message: "Internal Server Error",
//       code: "INTERNAL_SERVER_ERROR"
//     });
//   }
// });

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().populate("products");
    console.log(categories); // Log categories to inspect before sending the response
    res.json({
      status: "success",
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
        code: "CATEGORY_NOT_FOUND",
      });
    } else {
      res.json({
        status: "success",
        message: "Category fetched successfully",
        category,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    //update
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!category) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
        code: "CATEGORY_NOT_FOUND",
      });
    } else {
      res.json({
        status: "success",
        message: "Category updated successfully",
        category,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

// @desc    delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      res.status(404).json({
        status: "error",
        message: "Category not found",
        code: "CATEGORY_NOT_FOUND",
      });
    } else {
      res.json({
        status: "success",
        message: "Category deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});
