const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "sait-db",
  password: "1q12w23e3=ilY",
});

module.exports = con;
