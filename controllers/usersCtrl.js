import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

export const registerUserCtrl = asyncHandler(async (req, res) => {
  try {
    const { userName, email, phoneNumber, password, confirmPassword } =
      req.body;
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

    const userData = {
      username: user.userName,
      email: user.email,
      password: user.password,
      confirmPassword: user.confirmPassword,
      phoneNumber: user.phoneNumber,
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

export const addShippingAddressCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    phone,
    postalCode,
    state,
    city,
    houseNumber,
    roadName,
    isSelected: isSelectedFromRequest,
  } = req.body;

  const newAddress = {
    name,
    phone,
    postalCode,
    state,
    city,
    houseNumber,
    roadName,
    isSelected: isSelectedFromRequest,
  };

  const user = await User.findById(req.userAuthId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  user.shippingAddresses.push(newAddress);
  user.hasShippingAddress = true;

  const updatedUser = await user.save();

  const addedAddress =
    updatedUser.shippingAddresses[updatedUser.shippingAddresses.length - 1];

  const { _id, isSelected, ...addressWithoutIdAndSelected } =
    addedAddress.toObject();

  res.json({
    status: "success",
    message: "Shipping address added successfully",
    data: addressWithoutIdAndSelected,
  });
});

export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  try {
    const userId = req.userAuthId;
    const addressId = req.params.id;
    const { name, phone, postalCode, state, city, houseNumber, roadName } =
      req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const address = user.shippingAddresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Shipping address not found",
      });
    }

    address.name = name || address.name;
    address.phone = phone || address.phone;
    address.postalCode = postalCode || address.postalCode;
    address.state = state || address.state;
    address.city = city || address.city;
    address.houseNumber = houseNumber || address.houseNumber;
    address.roadName = roadName || address.roadName;

    await user.save();

    res.json({
      status: "success",
      message: "Shipping address updated successfully",
      updatedShippingAddress: address,
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

export const getShippingAddressCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId);
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  if (!user.hasShippingAddress) {
    return res.status(404).json({
      status: "error",
      message: "Shipping address not found for this user",
    });
  }
  const shippingAddressArray = user.shippingAddresses;

  res.json({
    shippingAddressArray,
  });
});

export const deleteShippingAddressCtrl = asyncHandler(async (req, res) => {
  try {
    const userId = req.userAuthId;
    const addressId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const address = user.shippingAddresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        status: "error",
        message: "Shipping address not found",
      });
    }

    address.remove();
    await user.save();

    res.json({
      status: "success",
      message: "Shipping address deleted successfully",
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

// Controller to get the default shipping address
export const getDefaultShippingAddressCtrl = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  if (!user.shippingAddresses || user.shippingAddresses.length === 0) {
    return res.status(404).json({
      status: "error",
      message: "Shipping address not found for this user",
    });
  }

  let defaultShippingAddress = user.shippingAddresses;

  let x = user.shippingAddresses;
  // console.log("=================xxxxxxxxxxxx===================");
  // console.log(x.length);
  // console.log("====================================");
  if (x.length === 1) {
    defaultShippingAddress = user.shippingAddresses[0];
    // console.log("====================if condition================");
    // console.log(defaultShippingAddress);
    // console.log("====================================");
  }
  if (x.length > 1) {
    defaultShippingAddress = user.shippingAddresses.find(
      (address) => address.isDefault === true
    );
    // console.log("====================else condition================");
    // console.log(defaultShippingAddress);
    // console.log("====================================");
  }
  // console.log("==================defaultShippingAddress==================");
  // console.log(defaultShippingAddress);
  // console.log("====================================");

  if (!defaultShippingAddress) {
    return res.json({
      status: "success",
      message: "No default shipping address set",
      defaultShippingAddress: null,
    });
  }

  res.json({
    status: "success",
    message: "Default shipping address found",
    defaultShippingAddress,
  });
});

// Controller to update the default shipping address
export const updateDefaultShippingAddressCtrl = asyncHandler(
  async (req, res) => {
    try {
      const userId = req.userAuthId;
      const addressId = req.params.id;
      const { name, phone, postalCode, state, city, houseNumber, roadName } =
        req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      const existingAddressIndex = user.shippingAddresses.findIndex(
        (address) => address._id.toString() === addressId
      );

      if (existingAddressIndex === -1) {
        return res.status(404).json({
          status: "error",
          message: "Shipping address not found",
        });
      }

      // Unset the default flag for all addresses
      user.shippingAddresses.forEach((address) => {
        address.isDefault = false;
      });

      // Update the specified address and set it as the default
      const addressToUpdate = user.shippingAddresses[existingAddressIndex];
      addressToUpdate.name = name || addressToUpdate.name;
      addressToUpdate.phone = phone || addressToUpdate.phone;
      addressToUpdate.postalCode = postalCode || addressToUpdate.postalCode;
      addressToUpdate.state = state || addressToUpdate.state;
      addressToUpdate.city = city || addressToUpdate.city;
      addressToUpdate.houseNumber = houseNumber || addressToUpdate.houseNumber;
      addressToUpdate.roadName = roadName || addressToUpdate.roadName;
      addressToUpdate.isDefault = true;

      // Save the updated address back to the user's addresses array
      user.shippingAddresses[existingAddressIndex] = addressToUpdate;

      // Save the updated user to the database
      const updatedUser = await user.save();

      // Find the updated default shipping address
      const defaultShippingAddress = updatedUser.shippingAddresses.find(
        (address) => address.isDefault
      );

      res.json({
        status: "success",
        message: "Default address changed successfully",
        defaultShippingAddress,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Internal Server Error",
      });
    }
  }
);
