import { check } from "express-validator";

const checkoutValidator = [
  check("name")
    .isString()
    .notEmpty()
    .escape()
    .trim()
    .stripLow()
    .withMessage("Il nome deve essere una stringa di almeno 2 caratteri"),
  check("surname")
    .isString()
    .notEmpty()
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
  check("cap")
    .trim()
    .stripLow()
    .isPostalCode("any")
    .withMessage("il cap non è valido"),
  check("cell_number")
    .trim()
    .stripLow()
    .blacklist(" -")
    .isMobilePhone("any")
    .withMessage("Il numero di cellulare non è valido"),
  check("cart")
    .isArray({ min: 1 })
    .withMessage("Il carrello deve contenere almeno un prodotto"),
  check("cart.*.id").isInt({ min: 1 }).withMessage("ID prodotto non valido"),
  check("cart.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantità prodotto non valida"),
  // check("payment_method")
  //   .trim()
  //   .stripLow()
  //   .blacklist(" -")
  //   .notEmpty()
  //   .isCreditCard()
  //   .withMessage("La carta di credito non è valida"),
];
export default checkoutValidator;
