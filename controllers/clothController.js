import { log } from "console";
import connection from "../data/db.js";
import sendOrderEmail from "../mailer.js";

// INDEX/PROMO CLOTHES
function promo(req, res) {
  // ex QUERY PER TAGLIE E PROMO
  const sqlSizesPromo = `SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
HAVING c.promo > 0`;
  // ex VESTITI IN PROMO
  connection.query(sqlSizesPromo, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}

// INDEX/MOST SOLD
function mostSold(req, res) {
  // ex QUERY PER MOST SOLD
  const sqlMostSold = `SELECT 
  c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
ORDER BY c.sold_number DESC
LIMIT 3`;
  // ex VESTITI PIU VENDUTI
  connection.query(sqlMostSold, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}
// SHOW/ SEARCH BAR FILTER
function searchBar(req, res) {
  const userInput = "%" + req.params.input + "%";
  // ex QUERY PER SEARCHBAR
  const sqlSearch = `
  SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
HAVING c.name 
LIKE ?
OR c.material
LIKE ?`;
  // ex LISTA DEI CAPI BASATI SU INPUT UTENTE
  connection.query(sqlSearch, [userInput, userInput], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}

// INDEX/CLOTHES LIST
function index(req, res) {
  // ex LISTA DI TUTTI I VESTITI
  const sqlClothes = `SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock`;
  // ex LISTA DI TUTTI I CAPI
  connection.query(sqlClothes, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}

// SHOW/CLOTH DETAILS
function show(req, res) {
  const slug = req.params.slug;
  // ex QUERY PER VESTITO SPECIFICO E TAGLIE E CATEGORIA
  const sqlSizes = `SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  categories.name AS category,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN categories ON c.categories_id = categories.id
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
HAVING c.slug = ?`;
  // ex DETTAGLIO E TAGLIE E CATEGORIA DEL VESTITO SPECIFICO
  connection.query(sqlSizes, [slug], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Cloth and sizes not found!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "Cloth not found!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}

// SHOW/ ALL FILTER TOGETHER
function allFilters(req, res) {
  const { price, size, category, order, query } = req.query;
  const ascOrDesc = order === "desc" ? "desc" : "asc";
  const conditions = [];
  const params = [];

  if (price) {
    conditions.push("c.price BETWEEN 0 AND ?");
    params.push(price);
  }
  if (size) {
    conditions.push("s.name = ?");
    params.push(size);
  }
  if (category) {
    conditions.push("categories.name = ?");
    params.push(category);
  }
  if (query) {
    conditions.push("c.name LIKE ?");
    params.push(`%${query}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  const sqlFilterAll = `
    SELECT 
      c.id,
      c.categories_id,
      c.name,
      c.img,
      c.price,
      c.sold_number,
      c.slug,
      c.stock,
      c.material,
      c.promo,
      categories.name AS category,
      JSON_ARRAYAGG(s.name) AS sizes
    FROM clothes c
    JOIN categories ON c.categories_id = categories.id
    JOIN clothes_sizes cs ON c.id = cs.cloth_id
    JOIN sizes s ON cs.size_id = s.id
    ${where}
    GROUP BY c.id, c.name, c.price, c.img, c.stock
    ORDER BY c.price ${ascOrDesc}
  `;

  connection.query(sqlFilterAll, params, (err, results) => {
    if (err) return res.status(500).json({ error: "Richiesta fallita!" });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map((currentCloth) => {
      currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img;
      return currentCloth;
    });
    res.json(results);
  });
}

// SHOW/ FILTER SIZES
function filterSizes(req, res) {
  const userInput = req.params.input;
  // ex QUERY PER FILTRO TAGLIE
  const sqlSFilterSizes = `
  SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
WHERE s.name = ?
GROUP BY c.id, c.name, c.price, c.img, c.stock`;
  // ex LISTA DEI CAPI BASATI SU FILTRO TAGLIE
  connection.query(sqlSFilterSizes, [userInput], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}
// SHOW/ FILTER CATEGORIES
function filterCategories(req, res) {
  const userInput = req.params.input;
  // ex QUERY PER FILTRO CATEGORIE
  const sqlFilterCategories = `
  SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  categories.name AS category,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN categories ON c.categories_id = categories.id
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id
HAVING categories.name = ?`;
  // ex LISTA DEI CAPI BASATI SU FILTRO CATEGORIE
  connection.query(sqlFilterCategories, [userInput], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}
// SHOW/ FILTER PRICES
function filterPrices(req, res) {
  const userInput = req.params.input;
  // ex QUERY PER FILTRO RANGE PREZZO
  const sqlFilterPrices = `
 SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo, 
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
HAVING c.price BETWEEN 0 AND ?`;
  // ex LISTA DEI CAPI BASATI SU FILTRO RANGE PREZZO
  connection.query(sqlFilterPrices, [userInput], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}
// SHOW/ FILTER PRICES ASCENDANT
function filterPricesAscendant(req, res) {
  // ex QUERY PER FILTRO PREZZO ASCENDENTE
  const sqlFilterPricesAscendant = `SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
ORDER BY c.price ASC`;
  // ex LISTA DEI CAPI BASATI SU FILTRO PRESSO ASCENDENTE
  connection.query(sqlFilterPricesAscendant, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}
// SHOW/ FILTER PRICES DESCENDANT
function filterPricesDescendant(req, res) {
  // ex QUERY PER FILTRO PREZZO DISCENDENTE
  const sqlFilterPricesDescendant = `SELECT 
   c.id,
  c.categories_id,
  c.name,
  c.img,
  c.price,
  c.sold_number,
  c.slug,
  c.stock,
  c.material,
  c.promo,
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
ORDER BY c.price DESC`;
  // ex LISTA DEI CAPI BASATI SU FILTRO PRESSO DISCENDENTE
  connection.query(sqlFilterPricesDescendant, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "No results, try again!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    res.json(results);
  });
}
// CREATE/CHECKOUT
function checkout(req, res) {
  console.log("checkout ready");

  const {
    name,
    surname,
    mail,
    address,
    cell_number,
    city,
    cap,
    promo_code_id,
    total_price,
    shipping_cost,
    cart,
  } = req.body;

  const sqlCheckout = `
    INSERT INTO clothes.orders 
    (name, surname, mail, address, cell_number, city, cap, promo_code_id, total_price, shipping_cost)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sqlCheckout,
    [
      name,
      surname,
      mail,
      address,
      cell_number,
      city,
      cap,
      promo_code_id,
      total_price,
      shipping_cost,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "Richiesta fallita!",
          err,
        });
      }

      const orderId = results.insertId;

      const insertItems = cart.map((item) => {
        return new Promise((resolve, reject) => {
          const sqlInsertItem = `
            INSERT INTO clothes_orders (cloth_id, order_id, order_quantity, size)
            VALUES (?, ?, ?, ?)
          `;
          connection.query(
            sqlInsertItem,
            [item.id, orderId, item.quantity, item.size],
            (err) => {
              if (err) return reject(err);
              resolve();
            }
          );
        });
      });

      Promise.all(insertItems)
        .then(() => {
          return sendOrderEmail({
            to: mail,
            subject: "Conferma Ordine - Boolshop",
            text: `Grazie per il tuo ordine, ${name}! Il tuo numero ordine è #${orderId}. Totale: ${total_price}€`,
            name,
            orderId,
            total: total_price,
          });
        })
        .then(() => {
          res.status(201).json({
            message: "Ordine inviato con successo",
            id: orderId,
          });
        })
        .catch((error) => {
          console.error("Errore:", error);
          res.status(500).json({
            message: "Errore durante il salvataggio dell'ordine o invio email.",
            error,
          });
        });
    }
  );
}

function validatePromoCode(req, res) {
  const { code } = req.body;

  if (!code) {
    return res.json({
      valid: false,
      message: "No promo codes added",
    });
  }

  const sql = `SELECT id, value FROM promo_codes WHERE code = ?`;

  connection.query(sql, [code.toUpperCase()], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ valid: false, message: "Server error", err });
    }

    if (results.length === 0) {
      return res.json({
        valid: false,
        message: "Invalid code",
      });
    }

    const promo = results[0];

    res.json({
      valid: true,
      promo_code_id: promo.id,
      discount: promo.value,
      message: `Valid code: ${promo.value}% discount`,
    });
  });
}

export {
  index,
  show,
  promo,
  mostSold,
  checkout,
  searchBar,
  filterCategories,
  filterPrices,
  filterPricesAscendant,
  filterPricesDescendant,
  filterSizes,
  allFilters,
  validatePromoCode,
};
