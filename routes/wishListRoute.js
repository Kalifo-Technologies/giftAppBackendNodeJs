import exppress from "express";

import { isLoggedIn } from "../middlewares/isLoggedIn.js";
import { addToWishList, getUserWishlists, removeFromWishList } from "../controllers/wishListCtrl.js";

const wishListsRouter = exppress.Router();

wishListsRouter.get("/get-all-wishlists",isLoggedIn, getUserWishlists);
wishListsRouter.post("/:id", isLoggedIn, addToWishList);
wishListsRouter.post("/:id/remove", isLoggedIn, removeFromWishList);

export default wishListsRouter;
