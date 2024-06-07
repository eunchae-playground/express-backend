import express from "express";
import * as controller from "../controllers/orders.js";
import authenticate from "../validators/middlewares/authenticate.js";
import * as validator from "../validators/order.js";

const router = express.Router();
router.use(express.json());

router.get("/", [authenticate], controller.myOrders);

router.post(
  "/",
  [...validator.getCreateOrderValidator(), authenticate],
  controller.createOrders
);

export default router;
