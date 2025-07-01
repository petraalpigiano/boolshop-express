import connection from "../data/db.js";

// INDEX/HOMEPAGE
// function homepage(req, res) {
//   // const sqlClothes = `SELECT * FROM movies`;
//   // connection.query(sqlClothes, (err, results) => {
//   //   if (err)
//   //     return res.status(500).json({
//   //       error: "Richiesta fallita!",
//   //     });
//   //   results.map(function (currentCloth) {
//   //     return (currentCloth.image =
//   //       "http://localhost:3000/imgs/movies_cover/" + currentCloth.image);
//   //   });
//   //   res.json(results);
//   // });
// }

// INDEX/CLOTHES LIST
function index(req, res) {
  // ex LISTA DI TUTTI I VESTITI
  const sqlClothes = `SELECT * FROM clothes`;
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

// SHOW/ CLOTH DETAILS
function show(req, res) {
  const slug = req.params.slug;
  // ex QUERY PER VESTITO SPECIFICO
  const sqlClothes = `SELECT * FROM clothes WHERE clothes.slug = ?  `;
  // ex QUERY PER TAGLIE
  const sqlSizes = `SELECT sizes.name
FROM clothes
INNER JOIN clothes_sizes
ON clothes.id = clothes_sizes.cloth_id
INNER JOIN sizes
ON clothes_sizes.size_id = sizes.id
WHERE clothes.slug = ?`;

  // ex QUERY PER CATEGORIA
  const sqlCategory = `
SELECT categories.name
FROM clothes
INNER JOIN categories
ON clothes.categories_id = categories.id
WHERE clothes.slug = ?`;

  // ex DETTAGLIO VESTITO SPECIFICO
  connection.query(sqlClothes, [slug], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "Cloth not found!" });
    }
    results.map(function (currentCloth) {
      return (currentCloth.img =
        "http://localhost:3000/imgs/clothes_imgs/" + currentCloth.img);
    });
    const cloth = results[0];
    // ex TAGLIE DEL VESTITO SPECIFICO
    connection.query(sqlSizes, [slug], (err, results) => {
      if (err)
        return res.status(500).json({
          error: "Sizes not found!",
        });
      cloth.sizes = results;
    });
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

export { index, show };
