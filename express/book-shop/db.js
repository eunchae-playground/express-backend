// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
export const connectionOption = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "book_shop",
  dateStrings: true,
}

const connection = await mysql.createConnection(connectionOption);


export default connection;
