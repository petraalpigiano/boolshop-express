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
// SHOW/ CLOTH DETAILS
router.get("/:slug", show);
// SHOW/ FILTER SIZES
router.get("/f-sizes", filterSizes);
// SHOW/ FILTER CATEGORIES
router.get("/f-categories", filterCategories);
// SHOW/ FILTER PRICES
router.get("/f-prices", filterPrices);
// SHOW/ FILTER PRICES ASCENDANT
router.get("/f-p-ascendant", filterPricesAscendant);
// SHOW/ FILTER PRICES DESCENDANT
router.get("/f-p-descendant", filterPricesDescendant);

export default router;
