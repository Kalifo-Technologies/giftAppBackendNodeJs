import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";

// @desc    Create new Brand
// @route   POST /api/v1/brands
// @access  Private/Admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    //brand exists
    const brandFound = await Brand.findOne({ name });
    if (brandFound) {
      res.status(409).json({
        status: "error",
        message: "Brand already exists",
        code: "BRAND_ALREADY_EXISTS"
      });
    } else {
      //create
      const brand = await Brand.create({
        name: name.toLowerCase(),
        user: req.userAuthId,
      });

      res.json({
        status: "success",
        message: "Brand created successfully",
        brand,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});


// @desc    Get all brands
// @route   GET /api/brands
// @access  Public

export const getAllBrandsCtrl = asyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json({
      status: "success",
      message: "Brands fetched successfully",
      brands,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});


// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      res.status(404).json({
        status: "error",
        message: "Brand not found",
        code: "BRAND_NOT_FOUND"
      });
    } else {
      res.json({
        status: "success",
        message: "Brand fetched successfully",
        brand,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});


// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    //update
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!brand) {
      res.status(404).json({
        status: "error",
        message: "Brand not found",
        code: "BRAND_NOT_FOUND"
      });
    } else {
      res.json({
        status: "success",
        message: "Brand updated successfully",
        brand,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});


// @desc    delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(req.params.id);
    
    if (!deletedBrand) {
      res.status(404).json({
        status: "error",
        message: "Brand not found",
        code: "BRAND_NOT_FOUND"
      });
    } else {
      res.json({
        status: "success",
        message: "Brand deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
      code: "INTERNAL_SERVER_ERROR"
    });
  }
});

