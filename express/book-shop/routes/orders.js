import express from "express";
import * as controller from "../controllers/orders.js";
import * as chain from "../validators/chains/order.js";
import authenticate from "../validators/middlewares/authenticate.js";
import validationErrorChecker from "../validators/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router.get("/", [authenticate], controller.myOrders);

router.post(
  "/",
  [...chain.getCreateOrderChains(), authenticate, validationErrorChecker],
  controller.createOrder
);

export default router;
