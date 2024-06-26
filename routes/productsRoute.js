import exppress from "express";
import { upload } from "../config/fileUpload.js";
import {
  createProductCtrl,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
  createMainImage,
} from "../controllers/productsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";
import { isLoggedIn } from "../middlewares/isLoggedIn.js";

const productsRouter = exppress.Router();

productsRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "regularImages", maxCount: 10 },
  ]),
  createProductCtrl
);
// productsRouter.post(
//   "/addmain-image",
//   isLoggedIn,
//   isAdmin,
//   upload.array("file"),
//   createMainImage
// );

productsRouter.get("/", getProductsCtrl);
productsRouter.get("/:id", getProductCtrl);
productsRouter.put(
  "/:id",
  isLoggedIn,
  isAdmin,
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "regularImages", maxCount: 10 },
  ]),
  updateProductCtrl
);
productsRouter.delete("/:id/delete", isLoggedIn, isAdmin, deleteProductCtrl);

export default productsRouter;
