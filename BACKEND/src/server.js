const express = require("express");
const configViewEngine = require("./config/viewEngine.js");
const initWebRoutes = require("./routes/web.js");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8080;

configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);

app.listen(PORT, () => {
  console.log("run succeed " + PORT);
});
