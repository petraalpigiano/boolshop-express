import express from "express";
import { promo, mostSold, searchBar } from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/CLOTHES LIST
router.get("/promo", promo);
// SHOW/ CLOTH DETAILS
router.get("/most-sold", mostSold);
// SHOW/ SEARCH BAR FILTER
router.get("/searchbar/:input", searchBar);

export default router;
