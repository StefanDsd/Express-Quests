const database = require("./database");


// WORKING ON EXPRESS QUEST 06 //
const getMovies = (req, res) => {

// let sql = " select * from movies"
// const sqlValues = [];

// if(req.query.color != null) {
//   sql += " where color = ?";
//   sqlValues.push(req.query.color);
// }
// if(req.query.max_duration != null) {
//   sql += " where duration >?";
//   sqlValues.push(req.query.max_duration);
// } 
// else if (req.query.max_duration != null) {
// sql += " where duration <= ?";
// sqlValues.push(req.query.max_duration);
// }
const initialSql = "select * from movies";
const where = [];
if (req.query.color != null) {
  where.push({
    column: "color",
    value: req.query.color,
    operator: "=",
  });
}
if (req.query.max_duration != null) {
  where.push({
      column: "duration",
      value: req.query.max_duration,
      operator: "<=",
    });
  
}
database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([movies]) => {
      res.json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });


  // database
  //   .query(sql, sqlValues)
  //   .then(([movies]) => {
  //     res.json(movies);
      
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //     res.status(500).send("error retrieving data from database");
  //   });
};

const getMovieById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from movies WHERE id = ?", [id])
    .then(([movies]) => {
      if (!movies.length) {
        res.json("no movies found");
      } else {
        res.json(movies);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send("error retrieving data from database");
    });
};




const postMovie = (req, res) => {
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "INSERT INTO movies(title, director, year, color, duration) VALUES ( ?, ?, ?, ?, ?)",
      [title, director, year, color, duration]
    )
    .then(([result]) => {
      res.location(`/api/movies/${result.insertId}`).senStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the movie");
    });
};

const updateMovie = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, director, year, color, duration } = req.body;

  database
    .query(
      "update movies set title = ?, director = ?, year = ?, color = ?, duration = ? where id = ?",
      [title, director, year, color, duration, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.status(404).send("Not Found");
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error editing the movie");
    });
};

module.exports = {
  getMovies,
  getMovieById,
  postMovie,
  updateMovie,
};
