import { StatusCodes } from "http-status-codes";
import mysql from "mysql2/promise";
import connection, { connectionOption } from "../db.js";

export const myOrders = async (req, res) => {
  try {
    const { userId } = req;

    const SQL = `
      SELECT
        orders.id,
        delivery_infoes.address,
        delivery_infoes.receiver,
        delivery_infoes.address,
        books.title as book_title,
        books.price as book_price,
        orders.book_amount,
        orders.ordered_at
      FROM orders
      LEFT JOIN books
        ON orders.book_id = books.id
      LEFT JOIN delivery_infoes
        ON orders.delivery_info_id = delivery_infoes.id
      WHERE user_id = ?
    `;
    const [orders] = await connection.query(SQL, [userId]);

    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  }
};

export const createOrders = async (req, res) => {
  const pool = mysql.createPool({ ...connectionOption, connectionLimit: 5 });
  const connection = await pool.getConnection();

  try {
    const { userId } = req;
    const { deliveryInfo, orderBooks } = req.body;
    const { address, detailAddress, receiver, contact } = deliveryInfo;

    await connection.beginTransaction();

    // delivery_info 생성
    const CREATE_DELIVERY_INFO_SQL = `
      INSERT INTO delivery_infoes
        (address, detail_address, receiver, contact)
      VALUES 
        (?, ?, ?, ?)
    `;
    const [createDelieveryInfoResult] = await connection.query(
      CREATE_DELIVERY_INFO_SQL,
      [address, detailAddress, receiver, contact]
    );

    for (const orderBook of orderBooks) {
      const { bookId, bookAmount } = orderBook;

      const SELECT_CART_SQL =
        "SELECT id FROM carts WHERE user_id = ? AND book_id = ?";
      const [cart] = await connection.query(SELECT_CART_SQL, [userId, bookId]);

      if (cart.length === 0) {
        await connection.rollback();
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "장바구니에 존재하지 않는 책입니다." });
      }

      const CREATE_ORDER_SQL = `
        INSERT INTO orders
          (user_id, book_id, book_amount, delivery_info_id)
        VALUES
          (?, ?, ?, ?)
      `;
      await connection.query(CREATE_ORDER_SQL, [
        userId,
        bookId,
        bookAmount,
        createDelieveryInfoResult.insertId,
      ]);
    }

    // TODO: 주문 완료한 장바구니 제거하는 SQL 추가

    await connection.commit();

    return res.status(StatusCodes.CREATED).end();
  } catch (error) {
    await connection.rollback();
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "서버 오류가 발생했습니다." });
  } finally {
    connection.release();
  }
};
