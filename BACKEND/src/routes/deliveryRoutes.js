const express = require("express");
const ghnController = require("../controllers/ghnController");

const router = express.Router();

router.post("/ghn/create-order", ghnController.handleCreateOrder);
router.get("/ghn/detail/:order_code", ghnController.handleGetOrderInfo);
router.post("/ghn/update", ghnController.handleUpdateOrder);
router.post("/ghn/cancel/:order_code", ghnController.handleCancelOrder);

module.exports = router;
