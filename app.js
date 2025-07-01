import express from "express";
import clothesRouter from "./routers/clothes.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import cors from "cors";
import "dotenv/config";
import connection from "./data/db.js";

// ENV
const { APP_PORT } = process.env;

// .EXPRESS
const app = express();

// MIDDLEWARE PER CORS
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
// MIDDLEWARE PER ASSET STATICI
app.use(express.static("public"));
// MIDDLEWARE PER JSON
app.use(express.json());

// SERVER STA ASCOLTANDO
app.listen(APP_PORT, () => {
  console.log(`Il server è in ascolto alla porta: ${APP_PORT}`);
});

// POST ROUTER
app.use("/clothes", clothesRouter);

// INDEX/PROMO CLOTHES
app.get("/promo", (req, res) => {
  // ex QUERY PER PROMO
  const sqlPromo = `SELECT *
FROM clothes
WHERE clothes.promo > 0;`;
  // ex VESTITI IN PROMO
  connection.query(sqlPromo, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
});

// INDEX/ MOST SOLD
app.get("/most-sold", (req, res) => {
  // ex QUERY PER MOST SOLD
  const sqlMostSold = `SELECT *
FROM clothes
ORDER BY clothes.sold_number DESC
LIMIT 3`;
  // ex VESTITI PIU VENDUTI
  connection.query(sqlMostSold, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
});
// CREATE/ CHECKOUT
app.get("/checkout", (req, res) => {
  //  const id = parseInt(req.params.id);
  // const vote = parseInt(req.body.vote);
  const { name, surname, mail, address, cell_number, city, cap } = req.body;
  // ex QUERY PER INVIO DATI GUEST
  const sqlCheckout = `
  INSERT INTO clothes.orders (name, surname, mail, address, cell_number, city, cap) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  // // ex QUERY PER INSERIMENTO ORDER_ID SU CLOTHES_ORDER
  // const sqlOrderId = `INSERT INTO clothes.clothes_orders (cloth_id) VALUES (?);`;
  // ex INVIO DATI GUEST
  connection.query(
    sqlCheckout,
    [name, surname, mail, address, cell_number, city, cap],
    (err, results) => {
      if (err)
        return res.status(500).json({
          message: "Richiesta fallita!",
          err,
        });

      res.status(201).json({
        message: "Ordine inviato con successo",
        id: results.insertId,
      });
    }
  );
  // // ex INSERIMENTO ID
  // connection.query(sqlOrderId, [], (err, results) => {
  //   if (err)
  //     return res.status(500).json({
  //       message: "Richiesta fallita!",
  //       err,
  //     });

  //   res.status(201).json({
  //     message: "Ordine ID inserito con successo",
  //     id: results.insertId,
  //   });
  // });
});

// MIDDLEWARE PER LA GESTIONE DEGLI ERRORI DEL SERVER
app.use(errorHandler);
// MIDDLEWARE PER LA GESTIONE DELLE ROTTE NON REGISTRATE
app.use(notFoundHandler);
