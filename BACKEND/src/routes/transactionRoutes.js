const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.handleGetAllTransactions);
router.post("/create", transactionController.handleCreateTransaction);
router.get("/user", transactionController.handleGetTransactionByUser);
router.delete("/:id", transactionController.handleDeleteTransaction);
router.get("/:id/:status", transactionController.handleGetTransactionByStatus);
router.patch("/:id/:decision", transactionController.handleTransactionMakeDicision);
module.exports = router;
