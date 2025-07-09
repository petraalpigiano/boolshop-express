import express from "express";
import { validationResult } from "express-validator";
import filtersValidator from "../middlewares/filtersValidator.js";
import {
  index,
  show,
  filterCategories,
  filterPrices,
  filterPricesAscendant,
  filterPricesDescendant,
  filterSizes,
  allFilters,
} from "../controllers/clothController.js";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/CLOTHES LIST
router.get("/", index);
// SHOW/ ALL FILTER TOGETHER
router.get("/f-all", filtersValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  allFilters(req, res, next);
});
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
