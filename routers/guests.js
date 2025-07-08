import express from "express";
import { checkout } from "../controllers/clothController.js";
import { validatePromoCode } from "../controllers/clothController.js";
import checkoutValidator from "../middlewares/checkoutValidator.js";
import { validationResult } from "express-validator";

// ROUTER
const router = express.Router();

// VARIE ROUTE
// INDEX/CLOTHES LIST
router.post("/checkout", checkoutValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  checkout(req, res, next);
});
router.post("/validate-code", validatePromoCode);

export default router;
