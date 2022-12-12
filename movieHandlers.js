
const database = require("./database")

const getMovies = (req, res) => {
  database
  .query("select * from movies")
  .then(([movies]) => {
    res.json(movies)
    console.log(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("error retrieving data from database");
  });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies WHERE id = ?", [id])
    .then(([movies]) => {
      if(!movies.length) {
        res.json("no movies found")
      } else {
        res.json(movies);
      }
      
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send("error retrieving data from database");
    });
}

const postMovie = (req, res) => {
  const { title, director, year, color, duration} = req.body;

  database.query("INSERT INTO movies(title, director, year, color, duration) VALUES ( ?, ?, ?, ?, ?)", 
  [title, director, year, color, duration])
  .then(([result]) => {
  res.location(`/api/movies/${result.insertId}`).senStatus(201);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send("Error saving the movie");
  });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
};
