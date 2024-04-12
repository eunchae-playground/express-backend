import express from "express";
import * as controller from "../controllers/books.js";
import * as chain from "../validators/chains/book.js";
import validationErrorChecker from "../validators/middlewares/validationErrorChecker.js";

const router = express.Router();
router.use(express.json());

router.get("/", [validationErrorChecker], controller.allBooks);

router.get(
  "/:id([0-9]+)",
  [...chain.getBookDetailChains(), validationErrorChecker],
  controller.bookDetail
);

router.get(
  "/categories",
  [validationErrorChecker],
  controller.allBookCategories
);

export default router;
