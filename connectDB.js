const Sequelize = require("sequelize");

const database = "sports_cal";
const username = "postgres";
const password = "congo";
const sequelize = new Sequelize(database, username, password, {
  host: "localhost",
  dialect: "postgres",
});

const connect = async () => {
    return sequelize.authenticate();
  }
  
  module.exports = {
    connect,
    sequelize
  };