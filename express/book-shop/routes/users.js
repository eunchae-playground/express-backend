import express from "express";
import * as controller from "../controllers/users.js";
import authenticate from "../validators/middlewares/authenticate.js";
import * as validator from "../validators/user.js";

const router = express.Router();
router.use(express.json());

router.post("/authenticate", controller.authenticate);

router.post("/join", [...validator.getJoinValidator()], controller.join);

router.post("/login", [...validator.getLoginValidator()], controller.login);

router.post("/logout", [authenticate], controller.logout);

router.post(
  "/users/reset-password/authenticate",
  [...validator.getresetPasswordAuthenticateValidator()],
  controller.resetPasswordAuthenticate
);

router.put(
  "/users/reset-password",
  [...validator.getResetPasswordValidator()],
  controller.resetPassword
);

export default router;
