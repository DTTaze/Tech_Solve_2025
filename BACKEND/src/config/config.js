const path = require("path");
const envPath = path.resolve(__dirname, "../../../.env");
require("dotenv").config({ path: envPath });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
  },
  production: {
    username: "prod_user",
    password: "prod_pass",
    database: "mydb_prod",
    host: "prod-db-server",
    dialect: "mysql"
  }
};

  