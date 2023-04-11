const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

//set  up
const app = express();
const port = 8082;
app.use(cors());

// Create a MySQL FoodieDB
const FoodieDB = mysql.createConnection({
  host: "localhost", //"127.0.0.1",
  port: "3306",
  user: "root",
  password: "Bahmuhsal2001?",
  database: "foodie",
});

// Connect to the MySQL server
FoodieDB.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL server: " + err.stack);
    return;
  }
  console.log("Connected to MySQL server as id " + FoodieDB.threadId);
});

// Add middleware for parsing JSON in the request body
app.use(bodyParser.json());

// Define an endpoint for getting data from the database and receive the data
app.get("/data", function (req, res) {
  const query = "SELECT * FROM Foodie.restaurants";
  FoodieDB.query(query, function (error, results) {
    if (error) {
      console.error("Error getting data from database: " + error.stack);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json(results);
  });
});

// Posting on database
// Define an endpoint for adding a new restaurant

app.post("/data", function (req, res) {
  const { name, type, businessNum, photo1, photo2, photo3 } = req.body;
  const restaurantsQuery =
    "INSERT INTO restaurants (name, type, businessNum,photo1,photo2,photo3) VALUES (?, ?, ?,?,?,?)";
  FoodieDB.query(
    restaurantsQuery,
    [name, type, businessNum, photo1, photo2, photo3],
    function (error, results) {
      if (error) {
        console.error("Error adding restaurant to database: " + error.stack);
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ message: "Restaurant added successfully" });
    }
  );
});

// Deleting restaurant from database

app.delete("/data", function (req, res) {
  const { name, businessNum } = req.body;
  const restaurantsQuery =
    "DELETE FROM restaurants WHERE name = ? AND businessNum = ?";
  FoodieDB.query(restaurantsQuery, [name, businessNum], (error, data) => {
    if (error) {
      console.error("Error adding restaurant to database: " + error.stack);
      return res.status(500).json({ message: "Internal server error" });
    }
    res.json({ message: "Restaurant data is not deleted" });
  });
});

// Start the server
app.listen(port, function () {
  console.log("Server listening on port " + port);
});
