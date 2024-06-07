import express from "express";
import * as controller from "../controllers/carts.js";
import * as validator from "../validators/cart.js";
import authenticate from "../validators/middlewares/authenticate.js";

const router = express.Router();
router.use(express.json());

router.get("/", [authenticate], controller.myCarts);

router.post(
  "/",
  [...validator.getAddCartValidator(), authenticate],
  controller.addCart
);

router.delete(
  "/",
  [...validator.getDeleteCartsValidator(), authenticate],
  controller.deleteCarts
);

router.delete(
  "/:id",
  [...validator.getDeleteCartValidator(), authenticate],
  controller.deleteCart
);

export default router;
