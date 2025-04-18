const express = require("express");
const router = express.Router();
const rankController = require("../controllers/rankController.js");

router.get("/:id", rankController.handleGetRankById);

module.exports = router;