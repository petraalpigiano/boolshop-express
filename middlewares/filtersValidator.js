import { check } from "express-validator";

const filtersValidator = [
  check("price")
    .trim()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["10", "20", "30"])
    .withMessage("Il range di prezzo non è valido"),
  check("size")
    .trim()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["XS", "S", "M", "L"])
    .withMessage("La taglia non è valida"),
  check("category")
    .trim()
    .stripLow()
    .escape()
    .notEmpty()
    .isIn(["Tops", "Dresses", "Bottoms", "Outerwear", "Accessories"])
    .withMessage("La categoria non è valida"),
];

export default filtersValidator;
