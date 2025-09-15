const mysql = require("mysql2/promise");

const database = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: process.env.DB_NAME,
});

module.exports = database;
