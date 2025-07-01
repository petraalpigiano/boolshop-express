import express from "express";
import { index, show } from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/HOMEPAGE
// app.get("/", homepage);
// INDEX/CLOTHES LIST
router.get("/", index);
// SHOW/ CLOTH DETAILS
router.get("/:id", show);

export default router;
