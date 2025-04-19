const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.handleGetAllTransactions);
router.post("/create", transactionController.handleCreateTransaction);
router.get("/:user_id", transactionController.handleGetTransactionByUserId);
router.delete("/:id", transactionController.handleDeleteTransaction);

module.exports = router;
