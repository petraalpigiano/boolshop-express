import express from "express";
import {
  index,
  show,
  filterCategories,
  filterPrices,
  filterPricesAscendant,
  filterPricesDescendant,
  filterSizes,
} from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/CLOTHES LIST
router.get("/", index);
// SHOW/ FILTER SIZES
router.get("/f-sizes/:input", filterSizes);
// SHOW/ FILTER CATEGORIES
router.get("/f-categories/:input", filterCategories);
// SHOW/ FILTER PRICES
router.get("/f-prices/:input", filterPrices);
// SHOW/ FILTER PRICES ASCENDANT
router.get("/f-p-ascendant", filterPricesAscendant);
// SHOW/ FILTER PRICES DESCENDANT
router.get("/f-p-descendant", filterPricesDescendant);
// SHOW/ CLOTH DETAILS
router.get("/:slug", show);

export default router;
