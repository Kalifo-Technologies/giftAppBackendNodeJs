import exppress from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  getShippingAddressCtrl,
  addShippingAddressCtrl,
  updateShippingAddressCtrl,
  deleteShippingAddressCtrl,
  getDefaultShippingAddressCtrl,
  updateDefaultShippingAddressCtrl,
  deleteUserAccountCtrl,
  addProfilePictureCtrl,
  updateProfilePictureCtrl,
  getProfilePictureCtrl,
  addDateOfBirthCtrl,
  updateDateOfBirthCtrl,

} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import upload from "../config/profilePictureUpload.js";

const userRoutes = exppress.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);


userRoutes.post("/add/shipping", isLoggedIn, addShippingAddressCtrl);
userRoutes.get("/get/shipping", isLoggedIn, getShippingAddressCtrl);
userRoutes.put("/update/shipping/:id", isLoggedIn,updateShippingAddressCtrl);
userRoutes.delete("/delete/:id", isLoggedIn,deleteShippingAddressCtrl);

// get default address 

userRoutes.get("/get/defaultShippingAddress", isLoggedIn, getDefaultShippingAddressCtrl);
userRoutes.put("/update/defaultShippingAddress/:id", isLoggedIn,updateDefaultShippingAddressCtrl);

// delete user account
userRoutes.delete("/deleteAccount", isLoggedIn, deleteUserAccountCtrl)

// add profile picture
userRoutes.post("/add/profilePicture", isLoggedIn, upload.single('profilePicture'), addProfilePictureCtrl);

// Update profile picture
userRoutes.put("/update/profilePicture", isLoggedIn, upload.single('profilePicture'), updateProfilePictureCtrl);

// Get profile picture
userRoutes.get("/get/profilePicture", isLoggedIn, getProfilePictureCtrl); 

// add dob
userRoutes.post("/add/dateOfBirth", isLoggedIn, addDateOfBirthCtrl); 

//updating date of birth
userRoutes.put("/update/dateOfBirth", isLoggedIn, updateDateOfBirthCtrl);



export default userRoutes;
