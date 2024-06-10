import { StatusCodes } from "http-status-codes";
import pool from "../../db.js";

const errorHandler = (fn, options = {}) => {
  const { transaction } = options;

  return async (req, res) => {
    const connection = await pool.getConnection();
    req.connection = connection;

    try {
      await fn(req, res);
    } catch (error) {
      transaction && connection.rollback();
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류가 발생했습니다." });
    } finally {
      connection.release();
    }
  };
};

export default errorHandler;
