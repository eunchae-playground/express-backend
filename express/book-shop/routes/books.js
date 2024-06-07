import express from "express";
import * as controller from "../controllers/books.js";
import * as validator from "../validators/book.js";
import authenticate from "../validators/middlewares/authenticate.js";
import useLoggedInUser from "../validators/middlewares/useLoggedInUser.js";

const router = express.Router();
router.use(express.json());

router.get("/", [useLoggedInUser], controller.books);

router.get(
  "/:id([0-9]+)",
  [...validator.getBookDetailValidator(), useLoggedInUser],
  controller.bookDetail
);

router.post("/:id([0-9]+)/likes", [authenticate], controller.toggleBookLike);

router.get("/categories", controller.allBookCategories);

export default router;
