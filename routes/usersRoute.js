import exppress from "express";
import {
  registerUserCtrl,
  loginUserCtrl,
  getUserProfileCtrl,
  updateShippingAddresctrl,
  getShippingAddressCtrl,
  addShippingAddressCtrl,

} from "../controllers/usersCtrl.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const userRoutes = exppress.Router();

userRoutes.post("/register", registerUserCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.get("/profile", isLoggedIn, getUserProfileCtrl);


userRoutes.post("/add/shipping", isLoggedIn, addShippingAddressCtrl);


userRoutes.put("/update/shipping", isLoggedIn, updateShippingAddresctrl);
userRoutes.get("/get/shipping", isLoggedIn, getShippingAddressCtrl);

export default userRoutes;
