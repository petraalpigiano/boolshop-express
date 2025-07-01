import mysql from "mysql2";
import "dotenv/config";
const { APP_PASS } = process.env;

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: APP_PASS,
  database: "clothes",
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connesso al database!");
});

export default connection;
