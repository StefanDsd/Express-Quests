const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("select * from users")
    .then(([users]) => {
      res.json(users);
      console.log(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send("error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query("select * from users WHERE id = ?", [id])
    .then(([users]) => {
      if (!users.length) {
        res.json("no users found");
      } else {
        res.json(users);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(404).send("error retrieving data from database");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language } = req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).senStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the user");
    });
};
module.exports = {
  getUsers,
  getUserById,
  postUser,
};
