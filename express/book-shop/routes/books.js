import express from "express";
import * as controller from "../controllers/books.js";
import * as chain from "../validators/chains/book.js";
import authenticate from "../validators/middlewares/authenticate.js";
import useLoggedInUser from "../validators/middlewares/useLoggedInUser.js";
import validationErrorChecker from "../validators/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router.get("/", [useLoggedInUser, validationErrorChecker], controller.allBooks);

router.get(
  "/:id([0-9]+)",
  [...chain.getBookDetailChains(), useLoggedInUser, validationErrorChecker],
  controller.bookDetail
);

router.post(
  "/:id([0-9]+)/likes",
  [authenticate, validationErrorChecker],
  controller.toggleBookLike
);

router.get(
  "/categories",
  [validationErrorChecker],
  controller.allBookCategories
);

export default router;
