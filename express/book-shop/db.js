// Get the client
import mysql from "mysql2/promise";

// Create the connection to database
export const poolOption = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "book_shop",
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const pool = mysql.createPool(poolOption);

export default pool;
