const express = require("express");
const transactionController = require("../controllers/transactionController");

const router = express.Router();

router.get("/", transactionController.handleGetAllTransactions);
router.post("/create", transactionController.handleCreateTransaction);
router.get("/buyer", transactionController.handleGetTransactionByBuyerId);
router.get("/seller", transactionController.handleGetTransactionBySellerId);
router.delete("/:id", transactionController.handleDeleteTransaction);
router.patch(
  "/:id/:decision",
  transactionController.handleTransactionMakeDicision
);
router.get("/:status", transactionController.handleGetAllTransactionsByStatus);
module.exports = router;
