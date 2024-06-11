import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Debugging line
    console.log("Request File:", req.file); // Debugging line

    const { name, specifiedFor } = req.body;

    // Check if name and specifiedFor are defined
    if (!name || !specifiedFor) {
      return res.status(400).json({
        status: "error",
        message: "Category name and specifiedFor are required",
        code: "CATEGORY_NAME_SPECIFIEDFOR_REQUIRED",
      });
    }

    const image = req.file ? req.file.path : null;

    console.log("Uploaded Image:", image);

    const categoryFound = await Category.findOne({ name });
    if (categoryFound) {
      return res.status(409).json({
        status: "error",
        message: "Category already exists",
        code: "CATEGORY_ALREADY_EXISTS",
      });
    }

    const category = await Category.create({
      name: name.toLowerCase(),
      specifiedFor: specifiedFor,
      user: req.userAuthId,
      image: image, // Assuming you want to store a single image
    });

    console.log("===================category=================");
    console.log(category);
    console.log("====================================");

    res.json({
      status: "success",
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find().populate("products");
    const categoryIds = categories.map((category) => category._id.toString());
    console.log(categoryIds);

    res.json({
      status: "success",
      message: "Categories fetched successfully",
      categories: categoryIds,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    console.log('====================================');
    console.log(category);
    console.log('====================================');
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
