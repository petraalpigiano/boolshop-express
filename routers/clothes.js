import express from "express";
import { index, show } from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX
router.get("/", index);
// SHOW
router.get("/:id", show);

export default router;
