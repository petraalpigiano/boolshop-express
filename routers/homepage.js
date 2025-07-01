import express from "express";
import { promo, mostSold } from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/CLOTHES LIST
router.get("/promo", promo);
// SHOW/ CLOTH DETAILS
router.get("/most-sold", mostSold);

export default router;
