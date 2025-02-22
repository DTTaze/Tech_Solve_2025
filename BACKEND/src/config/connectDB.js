const { Sequelize } = require("sequelize");
const path = require("path");
const envPath = path.resolve(__dirname, "../../../.env");
require("dotenv").config({ path: envPath });


const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sync models: tự động tạo bảng nếu chưa có (không an toàn)
    await sequelize.sync({ alter: true }); // Hoặc { force: true } nếu muốn reset bảng

    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export default connection;
