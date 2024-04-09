// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "youtube",
  dateStrings: true,
});

export default connection;
