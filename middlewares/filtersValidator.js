import { check } from "express-validator";

const filtersValidator = [
  check("price")
    .optional()
    .stripLow()
    .escape()
    .exists()
    .notEmpty()
    .isIn(["10", "20", "30"])
    .withMessage("Il range di prezzo non è valido"),
  check("size")
    .optional()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["XS", "S", "M", "L"])
    .withMessage("La taglia non è valida"),
  check("category")
    .optional()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["Tops", "Dresses", "Bottoms", "Outerwear", "Accessories"])
    .withMessage("La categoria non è valida"),
  check("order")
    .optional()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["desc", "asc"])
    .withMessage("L'ordine non è valido"),
  check("promo")
    .optional()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["1"])
    .withMessage("La promo non è valida"),
  check("query")
    .optional()
    .isString()
    .stripLow()
    .notEmpty()
    .escape()
    .withMessage("L'input non è valido"),
];

export default filtersValidator;
