const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.post("/create", transactionController.handleCreateTransaction);
router.get("/:UserId", transactionController.handleGetTransactionByUserId);
router.delete("/:id", transactionController.handleDeleteTransaction);

module.exports = router;