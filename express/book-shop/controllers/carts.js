import { StatusCodes } from "http-status-codes";
import mysql from "mysql2/promise";
import connection, { connectionOption } from "../db.js";

export const myCarts = async (req, res) => {
  try {
    const { userId } = req;

    const SQL = `
      SELECT
        carts.id, books.id as book_id, carts.amount, books.title, books.image, books.detail, books.price
      FROM carts
      LEFT JOIN books
      ON carts.book_id = books.id
      WHERE user_id = ?
    `;
    const [myCarts] = await connection.query(SQL, [userId]);

    return res.status(StatusCodes.OK).json(myCarts);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const addCart = async (req, res) => {
  try {
    const { userId } = req;
    const { bookId, amount } = req.body;

    const SELECT_BOOK_SQL = "SELECT * from books WHERE id = ?";
    const [book] = await connection.query(SELECT_BOOK_SQL, [bookId]);

    if (book.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "존재하지 않는 bookId 입니다." });
    }

    const SELECT_CART_SQL =
      "SELECT * from carts WHERE book_id = ? and user_id = ?";
    const [cart] = await connection.query(SELECT_CART_SQL, [bookId, userId]);
    if (cart.length > 0) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "이미 장바구니에 존재하는 책입니다." });
    }

    const INSERT_CART_SQL =
      "INSERT INTO carts (book_id, user_id, amount) VALUES (?, ?, ?)";
    await connection.query(INSERT_CART_SQL, [bookId, userId, amount]);

    return res.status(StatusCodes.CREATED).end();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;

    const SELECT_CART_SQL = "SELECT * from carts WHERE id = ?";
    const [cart] = await connection.query(SELECT_CART_SQL, [id]);

    if (cart.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "해당 장바구니가 존재하지 않습니다." });
    }
    if (cart[0].user_id !== userId) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "권한이 없습니다." });
    }

    const DELETE_CART_SQL = "DELETE FROM carts WHERE id = ? AND user_id = ?";
    await connection.query(DELETE_CART_SQL, [id, userId]);
    return res.status(StatusCodes.OK).end();
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const deleteCarts = async (req, res) => {
  const pool = mysql.createPool({ ...connectionOption, connectionLimit: 5 });
  const connection = await pool.getConnection();

  try {
    const { userId } = req;
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "삭제할 장바구니 목록을 선택해 주세요." });
    }

    await connection.beginTransaction();

    for (const id of ids) {
      const SELECT_CART_SQL = "SELECT * from carts WHERE id = ?";
      const [cart] = await connection.query(SELECT_CART_SQL, [id]);

      if (cart.length === 0) {
        await connection.rollback();
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "유효하지 않은 id값이 존재합니다." });
      }
      if (cart[0].user_id !== userId) {
        await connection.rollback();
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: "권한이 없습니다." });
      }
    }

    const DELETE_CART_SQL = "DELETE FROM carts WHERE id in (?) AND user_id = ?";
    await connection.query(DELETE_CART_SQL, [ids, userId]);

    await connection.commit();

    return res.status(StatusCodes.OK).end();
  } catch (error) {
    await connection.rollback();
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  } finally {
    connection.release();
  }
};
