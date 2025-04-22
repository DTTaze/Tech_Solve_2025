const express = require("express");
const qrController = require("../controllers/qrController");

const router = express.Router();

router.get("/qr", qrController.handleCreateQR);

module.exports = router;
