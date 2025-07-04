import connection from "../data/db.js";

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
  console.log(userInput);
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
  // ex QUERY PER VESTITO SPECIFICO E TAGLIE
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
  JSON_ARRAYAGG(s.name) AS sizes
FROM clothes c
JOIN clothes_sizes cs ON c.id = cs.cloth_id
JOIN sizes s ON cs.size_id = s.id
GROUP BY c.id, c.name, c.price, c.img, c.stock
HAVING c.slug = ?`;
  // ex QUERY PER CATEGORIA
  const sqlCategory = `
SELECT categories.name
FROM clothes
INNER JOIN categories
ON clothes.categories_id = categories.id
WHERE clothes.slug = ?`;
  // ex DETTAGLIO E TAGLIE DEL VESTITO SPECIFICO
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
    const cloth = results[0];
    // ex CATEGORIA DEL VESTITO SPECIFICO
    connection.query(sqlCategory, [slug], (err, results) => {
      if (err)
        return res.status(500).json({
          error: "Category not found!",
        });
      cloth.category = results;
      res.json(cloth);
    });
  });
}

// CREATE/CHECKOUT
function checkout(req, res) {
  //  const id = parseInt(req.params.id);
  // const vote = parseInt(req.body.vote);
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
  } = req.body;
  // ex QUERY PER INVIO DATI GUEST
  const sqlCheckout = `
  INSERT INTO clothes.orders (name, surname, mail, address, cell_number, city, cap, promo_code_id, total_price, shipping_cost) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  // ex QUERY PER INSERIMENTO ORDER_ID SU CLOTHES_ORDER
  const sqlOrderId = `INSERT INTO clothes_orders(order_id)
SELECT orders.id
FROM orders
WHERE orders.id = LAST_INSERT_ID()`;
  // ex INVIO DATI GUEST
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
      if (err)
        return res.status(500).json({
          message: "Richiesta fallita!",
          err,
        });

      res.status(201).json({
        message: "Ordine inviato con successo",
        id: results.insertId,
      });
    }
  );
  // ex INSERIMENTO ID
  connection.query(sqlOrderId, [name, surname], (err, results) => {
    if (err)
      return res.status(500).json({
        message: "Richiesta fallita!",
        err,
      });
  });
}
export { index, show, promo, mostSold, checkout, searchBar };
