import mysql from "mysql2";
import "dotenv/config";

const { DB_PASS, DB_HOST, DB_USER, DB_NAME } = process.env;

const connection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connesso al database!");
});

export default connection;
