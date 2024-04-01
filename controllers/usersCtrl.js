import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc    Register user
// @route   POST /api/v1/users/register
// @access  Private/Admin



export const registerUserCtrl = asyncHandler(async (req, res) => {
  try {
    // console.log(req.body);

    const { userName, email, phoneNumber, password, confirmPassword } = req.body;

    // console.log("Name:", userName);
    // console.log("Email:", email);
    // console.log("Phone Number:", phoneNumber);
    // console.log("Password:", password);
    // console.log("Confirm Password:", confirmPassword);

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "error",
        message: "Passwords do not match",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        status: "error",
        message: "Username or email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      phoneNumber,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    console.log('====================================');
    console.log("user:::::", user);
    console.log('====================================');
    const userData = {
      username: user.userName,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      phoneNumber: user.phoneNumber
    };
    res.status(201).json({
      status: "success",
      message: "User Registered Successfully",
      data: userData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});


// @desc    Login user
// @route   POST /api/v1/users/login
// @access  Public

export const loginUserCtrl = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound && (await bcrypt.compare(password, userFound?.password))) {
      res.json({
        status: "success",
        message: "User logged in successfully",
        userFound,
        token: generateToken(userFound?._id),
      });
    } else {
      res.status(401).json({
        status: "error",
        message: "Invalid login credentials",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
});

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders");
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User profile not found",
    });
  }
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});

// @desc    Update user shipping address
// @route   PUT /api/v1/users/update/shipping
// @access  Private

export const updateShippingAddresctrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    {
      new: true,
    }
  );
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    user,
  });
});
