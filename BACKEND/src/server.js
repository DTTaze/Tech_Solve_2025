import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/api";
const session = require("express-session");
const passport = require("passport");
import bodyParser from "body-parser";
import connection from "./config/connectDB";
const { sequelize } = require("./models");
require("dotenv").config();
require("../src/config/passport");
import cors from "cors";
import { execSync } from "child_process";

const app = express();
const PORT = process.env.PORT || 4040;

// Cấu hình CORS
app.use(
  cors({
    origin: process.env.URL_REACT || "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["X-Requested-With", "Content-Type", "Authorization"],
    credentials: true,
  })
);

// Cấu hình View Engine
configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Nếu dùng HTTPS thì đặt true
  })
);

// Cấu hình Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware lưu user vào session
app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    req.session.user = req.user;
  }
  next();
});

// Khởi tạo route
initWebRoutes(app);
connection();

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`Đăng nhập bằng Google: http://localhost:${PORT}/auth/google`);
});

(async () => {
  try {
    await sequelize.sync(); // Sync DB
    console.log("\x1b[33m%s\x1b[0m", "Running database seeders...");
    execSync(
      "npm run seed",
      { stdio: "inherit" }
    );
    console.log("\x1b[32m%s\x1b[0m", "Database seeding completed!");
  } catch (e) {
    console.error("\x1b[31m%s\x1b[0m", "Database seeding failed.", e);
  }
})();
