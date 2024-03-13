import exppress from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { addToCart, getAllCarts, removeFromCart } from "../controllers/cartCtrl.js";

const cartsRouter = exppress.Router();

cartsRouter.get("/get-allCarts",isLoggedIn, getAllCarts);
cartsRouter.post("/:id", isLoggedIn, addToCart);
cartsRouter.post("/:id/remove", isLoggedIn, removeFromCart);

export default cartsRouter;
