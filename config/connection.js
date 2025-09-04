const mysql = require("mysql2/promise");

const database = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: process.env.DB_NAME,
});

module.exports = database;
