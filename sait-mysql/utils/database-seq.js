// import sequelize
const Sequelize = require("sequelize");

//connection to db
const sequelize = new Sequelize("sait-db", "root", "1q12w23e3=ilY", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});

module.exports = sequelize;
