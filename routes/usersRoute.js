import exppress from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  getShippingAddressCtrl,
  addShippingAddressCtrl,
  updateShippingAddressCtrl,

} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = exppress.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);


userRoutes.post("/add/shipping", isLoggedIn, addShippingAddressCtrl);


userRoutes.get("/get/shipping", isLoggedIn, getShippingAddressCtrl);

userRoutes.put("/update/shipping/:id", isLoggedIn,updateShippingAddressCtrl);


export default userRoutes;
