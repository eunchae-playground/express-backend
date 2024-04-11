import express from "express";
import * as controller from "../controllers/users.js";
import * as chain from "../validators/chains/user.js";
import isAuthenticated from "../validators/middlewares/isAuthenticated.js";
import validationErrorChecker from "../validators/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router.post(
  "/join",
  [...chain.getJoinChains(), validationErrorChecker],
  controller.join
);

router.post(
  "/login",
  [...chain.getLoginChains(), validationErrorChecker],
  controller.login
);

router.post(
  "/users/reset-password/request",
  [
    ...chain.getResetPasswordRequestChains(),
    isAuthenticated,
    validationErrorChecker,
  ],
  controller.resetPasswordRequest
);

router.put(
  "/users/reset-password/complete",
  [...chain.getResetPasswordChains(), isAuthenticated, validationErrorChecker],
  controller.resetPassword
);

export default router;
