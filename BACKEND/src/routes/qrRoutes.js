const express = require("express");
const qrController = require("../controllers/qrController");

const router = express.Router();

router.get("/", qrController.handleCreateQR);

module.exports = router;
