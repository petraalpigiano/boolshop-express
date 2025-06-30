import connection from "../data/db.js";

// INDEX
function index(req, res) {
  const sqlMovies = `SELECT * FROM movies`;
  connection.query(sqlMovies, (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    results.map(function (currentMovie) {
      return (currentMovie.image =
        "http://localhost:3000/imgs/movies_cover/" + currentMovie.image);
    });
    res.json(results);
  });
}
// SHOW
function show(req, res) {
  const id = parseInt(req.params.id);
  const sqlMovies = `SELECT * FROM movies WHERE movies.id =? `;
  const sqlReviews = `SELECT name, vote, text, reviews.created_at, reviews.updated_at FROM movies INNER JOIN reviews ON movies.id = reviews.movie_id WHERE movies.id = ? `;

  connection.query(sqlMovies, [id], (err, results) => {
    if (err)
      return res.status(500).json({
        error: "Richiesta fallita!",
      });
    if (results.length === 0) {
      return res.status(404).json({ error: "Film non trovato!" });
    }
    results.map(function (currentMovie) {
      return (currentMovie.image =
        "http://localhost:3000/imgs/movies_cover/" + currentMovie.image);
    });
    const movie = results[0];

    connection.query(sqlReviews, [id], (err, results) => {
      if (err)
        return res.status(500).json({
          error: "Richiesta fallita!",
        });
      movie.review = results;
      res.json(movie);
    });
  });
}

export { index, show };
