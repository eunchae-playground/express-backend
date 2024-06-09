import mysql from "mysql2/promise";
import { connectionOption } from "../db.js";

const createConnectionPool = async () => {
  const pool = mysql.createPool({ ...connectionOption, connectionLimit: 5 });
  const connectionPool = await pool.getConnection();

  return connectionPool;
};

export default createConnectionPool;
