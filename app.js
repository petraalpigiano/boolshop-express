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
    res.json(results);
  });
});

// MIDDLEWARE PER LA GESTIONE DEGLI ERRORI DEL SERVER
app.use(errorHandler);
// MIDDLEWARE PER LA GESTIONE DELLE ROTTE NON REGISTRATE
app.use(notFoundHandler);
