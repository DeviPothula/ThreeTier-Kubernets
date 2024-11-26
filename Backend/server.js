// server.js
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env",
});
// Ensure 'User' is destructured from 'models'
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

console.log("NODE_ENV ,,,", process.env.NODE_ENV);
console.log("DB_URL IN SERVER JS FILE:", process.env.DB_URL);
console.log("DB_USER IN SERVER JS FILE :", process.env.DB_USER);
console.log("DB_PASSWORD SERVER JS FILE:", process.env.DB_PASSWORD);
console.log("DB_NAME SERVER JS FILE:", process.env.DB_NAME);
console.log("DB HOST", process.env.DB_HOST)

const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_URL, { logging: false });

// Import models
const User = require("./models/user")(sequelize, DataTypes);

// Sync models
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.log("Error syncing database:", err));

module.exports = { sequelize, User };

const corsOptions = {
  origin: '*', // Allow all origins (for testing only)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Test database connection
app.get("/api/test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.findAll();
    console.log("USERS>>>", users);
    res.json(users); // Return the users as a JSON response
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST API to insert a user
app.post("/api/users", async (req, res) => {
  const { name } = req.body;

  // Validate the input (basic validation for name)
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    // Insert user into the database
    const newUser = await User.create({
      name: name,
    });

    // Return the created user as a response
    res.status(201).json(newUser); // Status 201 means created
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
