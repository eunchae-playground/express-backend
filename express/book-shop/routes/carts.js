import express from "express";
import * as controller from "../controllers/carts.js";
import * as chain from "../validators/chains/cart.js";
import authenticate from "../validators/middlewares/authenticate.js";
import validationErrorChecker from "../validators/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router.get("/", [authenticate], controller.myCarts);

router.post(
  "/",
  [...chain.getAddCartChains(), authenticate, validationErrorChecker],
  controller.addCart
);

router.delete(
  "/",
  [...chain.getDeleteCartsChains(), authenticate],
  controller.deleteCarts
);

router.delete(
  "/:id",
  [...chain.getDeleteCartChains(), authenticate],
  controller.deleteCart
);


export default router;
