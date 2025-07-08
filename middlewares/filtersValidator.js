import { check } from "express-validator";

const filtersValidator = [
  check("price")
    .optional()
    .trim()
    .stripLow()
    .escape()
    .exists()
    .notEmpty()
    .isIn(["10", "20", "30"])
    .withMessage("Il range di prezzo non è valido"),
  check("size")
    .optional()
    .trim()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["XS", "S", "M", "L"])
    .withMessage("La taglia non è valida"),
  check("category")
    .optional()
    .trim()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["Tops", "Dresses", "Bottoms", "Outerwear", "Accessories"])
    .withMessage("La categoria non è valida"),
];

export default filtersValidator;
