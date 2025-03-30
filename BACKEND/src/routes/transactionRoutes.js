const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();
console.log("Transaction Routes Loaded");
router.post("/create", transactionController.handleCreateTransaction);
router.get("/:UserId", transactionController.handleGetTransactionByUserId);
router.delete("/:id", transactionController.handleDeleteTransaction);

module.exports = router;