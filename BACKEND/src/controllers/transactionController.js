const transactionService = require('../services/transactionService');

const handleCreateTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const transaction = await transactionService.createTransaction(transactionData);
    return res.success("Transaction created successfully", transaction);
  } catch (error) {
    return res.error(500, "Failed to create transaction", error.message);
  }
}

const handleGetTransactionByUserId = async (req, res) => {
  try {
    const transaction_id = Number(req.params.UserId);
    const transaction = await transactionService.getTransactionByUserId(transaction_id);
    return res.success("Transaction retrieved successfully", transaction);
  } catch (error) {
    return res.error(500, "Failed to fetch transaction", error.message);
  }
}

const handleDeleteTransaction = async (req, res) => {
  try {
    const transaction_id = Number(req.params.id);
    const message = await transactionService.deleteTransaction(transaction_id);
    return res.success("Transaction deleted successfully", message);
  } catch (error) {
    return res.error(500, "Failed to delete transaction", error.message);
  }
}
module.exports = {
    handleCreateTransaction,
    handleDeleteTransaction,
    handleGetTransactionByUserId,
    // handleGetAllTransactions,
    // handleUpdateTransaction,
    };