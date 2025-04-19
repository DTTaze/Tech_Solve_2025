import React, { useState, useEffect } from "react";
import DataTable from "./DataTable";
import { transactionsColumns } from "./HeaderColumn";
import { Box, Typography } from "@mui/material";
import { getAllTransactionsApi, deleteTransactionsApi } from "../../utils/api";

export default function TransactionsManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllTransactionsApi();
        if (res.success) {
          setTransactions(res.data);
        } else {
          setError(res.error);
          console.log(res.error);
        }
      } catch (e) {
        setError(e);
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteTransaction = async (transaction) => {
    const res = await deleteTransactionsApi(transaction.id);
    console.log(transaction, transaction.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa giao dịch thành công!");
        setTransactions((prev) => prev.filter((u) => u.id !== transaction.id));
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Transactions Management
      </Typography>
      <DataTable
        title="Transactions"
        columns={transactionsColumns}
        rows={transactions}
        onAdd={false}
        onEdit={false}
        onDelete={handleDeleteTransaction}
        loading={loading}
      />
    </Box>
  );
}
