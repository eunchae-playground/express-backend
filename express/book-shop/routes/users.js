import express from "express";
import * as controller from "../controllers/users.js";
import * as chain from "../validators/chains/user.js";
import authenticate from "../validators/middlewares/authenticate.js";
import validationErrorChecker from "../validators/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router.post("/authenticate", controller.authenticate);

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

router.post("/logout", [authenticate], controller.logout);

router.post(
  "/users/reset-password/authenticate",
  [...chain.getresetPasswordAuthenticateChains(), validationErrorChecker],
  controller.resetPasswordAuthenticate
);

router.put(
  "/users/reset-password",
  [...chain.getResetPasswordChains(), validationErrorChecker],
  controller.resetPassword
);

export default router;
