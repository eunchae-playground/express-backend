import { StatusCodes } from "http-status-codes";
import bookService from "../services/bookService.js";
import cartService from "../services/cartService.js";
import isEmptyArray from "../utils/isEmptyArray.js";
import errorHandler from "./helpers/errorHandler.js";

export const myCarts = errorHandler(async (req, res) => {
  const { connection, userId } = req;

  const data = await cartService.getAllUserCarts({ connection, userId });

  return res.status(StatusCodes.OK).json(data);
});

export const addCart = errorHandler(async (req, res) => {
  const { connection, userId } = req;
  const { bookId, amount } = req.body;

  const book = await bookService.getBook({ connection, bookId });
  if (!book) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "존재하지 않는 bookId 입니다." });
  }

  const cart = await cartService.getCart({ connection, userId, bookId });
  if (cart) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "이미 장바구니에 존재하는 책입니다." });
  }

  await cartService.addCart({ connection, userId, bookId, amount });

  return res.status(StatusCodes.CREATED).end();
});

export const deleteCart = errorHandler(async (req, res) => {
  const { connection, userId } = req;
  const { id: cartId } = req.params;

  const cart = await cartService.getCart({ connection, cartId });
  if (!cart) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "해당 장바구니가 존재하지 않습니다." });
  }
  if (cart.user_id !== userId) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: "권한이 없습니다." });
  }

  await cartService.removeCart({ connection, cartId });

  return res.status(StatusCodes.OK).end();
});

export const deleteCarts = errorHandler(async (req, res) => {
  const { connection, userId } = req;
  const { ids } = req.body;

  if (isEmptyArray(ids)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "삭제할 장바구니 목록을 선택해 주세요." });
  }

  for (const cartId of ids) {
    const cart = await cartService.getCart({ connection, cartId });

    if (!cart) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "유효하지 않은 id값이 존재합니다." });
    }
    if (cart.user_id !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "권한이 없습니다." });
    }
  }

  await cartService.removeMultipleCarts({ connection, ids });

  return res.status(StatusCodes.OK).end();
});
