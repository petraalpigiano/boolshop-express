import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ventilatore",
  database: "clothes",
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connesso al database!");
});

export default connection;
