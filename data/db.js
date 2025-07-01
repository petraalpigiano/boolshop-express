import mysql from "mysql2";
import "dotenv/config";
<<<<<<< HEAD
=======

const { APP_PASS } = process.env;
>>>>>>> a3ff32a55ad77631a7d514a6fe385323aa34f484

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
