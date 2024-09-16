const express = require("express");

const { Pool } = require("pg");
require("dotenv").config();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let pool;
// Connect to database
if (process.env.DB_URL) {
  pool = new Pool(process.env.DB_URL);
} else {
   pool = new Pool(
    {
      user: DB_USER,
      password: DB_PASS,
      host: "localhost",
      database: "employee_db",
    },
    console.log(`Connected to the employee_db database.`)
  );
}
pool.connect();

// Create an employee

// Read all employees

// Delete an employee

// Default response
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
