import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
const session = require("express-session");
const passport = require("passport");
import bodyParser from "body-parser";
import connection from "./config/connectDB";
require("dotenv").config();
require("../src/config/passport");

const app = express();
const PORT = process.env.PORT || 8080;

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
