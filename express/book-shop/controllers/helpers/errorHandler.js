import { StatusCodes } from "http-status-codes";
import createConnectionPool from "../../helpers/createConnectionPool.js";

const errorHandler = (fn, options = {}) => {
  const { transaction } = options;

  return async (req, res) => {
    const connectionPool = transaction && (await createConnectionPool());
    req.connectionPool = connectionPool;

    try {
      await fn(req, res);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "서버 오류가 발생했습니다." });
    } finally {
      transaction && (await connectionPool.release());
    }
  };
};

export default errorHandler;
