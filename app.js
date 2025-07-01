import express from "express";
import clothesRouter from "./routers/clothes.js";
import homepageRouter from "./routers/homepage.js";
import guestsRouter from "./routers/guests.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import cors from "cors";
import "dotenv/config";

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

// HOMEPAGE ROUTER
app.use("/homepage", homepageRouter);
// CLOTHES ROUTER
app.use("/clothes", clothesRouter);
// GUESTS ROUTER
app.use("/guest", guestsRouter);

// MIDDLEWARE PER LA GESTIONE DEGLI ERRORI DEL SERVER
app.use(errorHandler);
// MIDDLEWARE PER LA GESTIONE DELLE ROTTE NON REGISTRATE
app.use(notFoundHandler);
