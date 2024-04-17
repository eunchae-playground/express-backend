import { StatusCodes } from "http-status-codes";
import mysql from "mysql2/promise";
import { connectionOption } from "../db.js";

export const createOrder = async (req, res) => {
  const pool = mysql.createPool({ ...connectionOption, connectionLimit: 5 });
  const connection = await pool.getConnection();

  try {
    const { userId } = req;
    const { deliveryInfo, bookId, bookAmount } = req.body;
    const { address, receiver, contact } = deliveryInfo;

    await connection.beginTransaction();

    const CREATE_DELIVERY_INFO_SQL = `INSERT INTO delivery_infoes (address, receiver, contact) VALUES ("${address}", "${receiver}", "${contact}")`;
    const [createDelieveryInfoResult] = await connection.query(
      CREATE_DELIVERY_INFO_SQL
    );

    const CREATE_ORDER_SQL = `INSERT INTO orders (user_id, book_id, book_amount, delivery_info_id) VALUES (${userId}, ${bookId}, ${bookAmount}, ${createDelieveryInfoResult.insertId})`;
    await connection.query(CREATE_ORDER_SQL);

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
