const express = require("express");
const coinController = require("../controllers/coinController");
const router = express.Router();

router.get("/:id", coinController.handleGetCoin);
router.put("/update/:id", coinController.handleUpdateCoin);
router.put("/increase/:id", coinController.handleIncreaseCoin);
router.put("/decrease/:id", coinController.handleDecreaseCoin);

export default router;
