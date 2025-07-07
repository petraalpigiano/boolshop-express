import express from "express";
import { checkout } from "../controllers/clothController.js";
import { validatePromoCode } from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/CLOTHES LIST
router.post("/checkout", checkout);
router.post("/validate-code", validatePromoCode);

export default router;
