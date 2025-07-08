import { check, matchedData } from "express-validator";

const checkoutValidator = [
  // name: deve essere una stringa non vuota, di minimo 2 caratteri
  check("name")
    .isString()
    .notEmpty()
    .isLength({ min: 2 })
    .withMessage("Il nome deve essere una stringa di almeno 2 caratteri"),
];

export default checkoutValidator;
