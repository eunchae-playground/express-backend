import { StatusCodes } from "http-status-codes";
import bookService from "../services/bookService.js";
import errorHandler from "./helpers/errorHandler.js";

export const books = errorHandler(async (req, res) => {
  const { connection, userId } = req;
  const { categoryId, latest, page, size } = req.query;

  const data = await bookService.getAllBooksWithLikesAndCategory({
    connection,
    userId,
    categoryId,
    latest,
    page,
    size,
  });

  return res.status(StatusCodes.OK).json(data);
});

export const bookDetail = errorHandler(async (req, res) => {
  const { connection, userId } = req;
  const bookId = parseInt(req.params.id);

  const data = await bookService.getBookWithLikesAndCategory({
    connection,
    bookId,
    userId,
  });

  if (!data) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "책이 존재하지 않습니다." });
  }

  return res.status(StatusCodes.OK).json(data);
});

export const allBookCategories = errorHandler(async (req, res) => {
  const { connection } = req;

  const data = await bookService.getAllBookCategories({ connection });

  return res.status(StatusCodes.OK).json(data);
});

export const toggleBookLike = errorHandler(async (req, res) => {
  const { connection, userId } = req;
  const { id: bookId } = req.params;

  const book = await bookService.getBook({ connection, bookId });
  if (!book) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "존재하지 않는 책입니다." });
  }

  const { isLiked } = await bookService.toggleBookUserLike({
    connection,
    bookId,
    userId,
  });
  return res.status(StatusCodes.OK).json({ isLiked });
});
