const transactionService = require("../services/transactionService");

const handleCreateTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    if (!transaction) {
      return res.error(400, "Transaction creation failed", req.body);
    }
    return res.success("Transaction created successfully", transaction);
  } catch (error) {
    console.log("Transaction Data:", req.body);
    return res.error(500, "Failed to create transaction", error.message);
  }
};

const handleGetAllTransactions = async (req, res) => {
  try {
    const transaction = await transactionService.getAllTransactions();
    return res.success("Transactions retrieved successfully", transaction);
  } catch (error) {
    return res.error(500, "Failed to fetch transactions", error.message);
  }
};

const handleGetTransactionByBuyerId = async (req, res) => {
  try {
    const user_id = Number(req.user.id);
    const transaction = await transactionService.getTransactionByBuyerId(
      user_id
    );
    return res.success("Transaction retrieved successfully", transaction);
  } catch (error) {
    return res.error(500, "Failed to fetch transaction", error.message);
  }
};

const handleGetTransactionBySellerId = async (req, res) => {
  try {
    const user_id = Number(req.user.id);
    const transaction = await transactionService.getTransactionBySellerId(
      user_id
    );
    return res.success("Transaction retrieved successfully", transaction);
  } catch (error) {
    return res.error(500, "Failed to fetch transaction", error.message);
  }
};

const handleDeleteTransaction = async (req, res) => {
  try {
    const transaction_id = req.params.id;
    const message = await transactionService.deleteTransaction(transaction_id);
    return res.success("Transaction deleted successfully", message);
  } catch (error) {
    return res.error(500, "Failed to delete transaction", error.message);
  }
};

const handleTransactionMakeDicision = async (req, res) => {
  try {
    const transaction_id = req.params.id;
    const decision = req.params.decision;

    const message = await transactionService.makeDecision(
      transaction_id,
      decision
    );
    return res.success("Get transaction by status success", message);
  } catch (error) {
    return res.error(500, "Failed to get transaction by status", error.message);
  }
};

const handleGetAllTransactionsByStatus = async (req, res) => {
  try {
    const status = req.params.status;

    const message = await transactionService.getAllTransactionsByStatus(status);
    return res.success("Get transaction by status success", message);
  } catch (error) {
    return res.error(500, "Failed to get transaction by status", error.message);
  }
};
module.exports = {
  handleCreateTransaction,
  handleDeleteTransaction,
  handleGetTransactionByBuyerId,
  handleGetAllTransactions,
  handleTransactionMakeDicision,
  handleGetAllTransactionsByStatus,
  handleGetTransactionBySellerId,
};
