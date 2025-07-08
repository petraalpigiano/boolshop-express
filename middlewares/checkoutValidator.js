import { check, matchedData } from "express-validator";

const checkoutValidator = [
  // name: deve essere una stringa non vuota, di minimo 2 caratteri
  check("name")
    .isString()
    .notEmpty()
    .isLength({ min: 2 })
    .escape()
    .trim()
    .stripLow()
    .withMessage("Il nome deve essere una stringa di almeno 2 caratteri"),
  check("surname")
    .isString()
    .notEmpty()
    .isLength({ min: 2 })
    .escape()
    .trim()
    .stripLow()
    .withMessage("Il cognome deve essere una stringa di almeno 2 caratteri"),
  check("mail")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("L'email non è valida"),
  check("address")
    .isString()
    .notEmpty()
    .isLength({ min: 5 })
    .trim()
    .escape()
    .stripLow()
    .withMessage("L'indirizzo non è valido"),
  check("city")
    .isString()
    .notEmpty()
    .isLength({ min: 2 })
    .trim()
    .escape()
    .stripLow()
    .withMessage("La citta non è valida"),
  // check("payment_method").isCreditCard(),
  // check("postal_code").isPostalCode(),
];
export default checkoutValidator;
