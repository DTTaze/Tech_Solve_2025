import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/api";
const session = require("express-session");
const passport = require("passport");
import bodyParser from "body-parser";
import connection from "./config/connectDB";
import { sequelize } from "./models";
require("dotenv").config();
require("../src/config/passport");

const app = express();
const PORT = process.env.PORT || 4040;
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware session (cần thiết cho passport)
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

initWebRoutes(app);
connection();
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`Đăng nhập bằng Google: http://localhost:${PORT}/auth/google`);
});
try {
  sequelize.sync(); //can fix autosync db
  console.log("thanh cong");
} catch (e) {
  console.log(e);
}
