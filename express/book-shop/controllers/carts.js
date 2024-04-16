import { StatusCodes } from "http-status-codes";
import connection from "../db.js";

export const myCarts = async (req, res) => {
  try {
    const { userId } = req;

    const CARTS_SQL = `
      SELECT
        carts.id, books.title, books.image, books.detail, books.price
      FROM carts
      LEFT JOIN books
      ON carts.book_id = books.id
      WHERE user_id = ${userId}
    `;
    const [cartsResult] = await connection.query(CARTS_SQL);

    return res.status(StatusCodes.OK).json(cartsResult);
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.sqlMessage });
  }
};

export const addCart = async (req, res) => {
  try {
    const { userId } = req;
    const { bookId, amount } = req.body;

    const BOOK_SQL = `SELECT * from books WHERE id = ${bookId}`;
    const [bookResult] = await connection.query(BOOK_SQL);
    if (bookResult.length < 1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 bookId 입니다." });
    }

    const CART_SQL = `SELECT * from carts WHERE book_id = ${bookId} and user_id = ${userId}`;
    const [cartResult] = await connection.query(CART_SQL);
    console.log(cartResult);
    if (cartResult.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 장바구니에 존재하는 책입니다." });
    }

    const INSERT_CART_SQL = `INSERT INTO carts (book_id, user_id, amount) VALUES (${bookId}, ${userId}, ${amount})`;
    await connection.query(INSERT_CART_SQL);

    return res.status(StatusCodes.CREATED).end();
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.sqlMessage });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const CART_SQL = `SELECT * from carts WHERE id = ${id}`;
    const [cartResult] = await connection.query(CART_SQL);
    if (cartResult.length < 1) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "존재하지 않는 목록입니다." });
    }
    if (cartResult[0].user_id !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "권한이 없습니다." });
    }

    const DELETE_CART_SQL = `DELETE FROM carts WHERE id = ${id} AND user_id = ${userId}`;
    await connection.query(DELETE_CART_SQL);
    return res.status(StatusCodes.OK).end();
  } catch (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: error.sqlMessage });
  }
};
