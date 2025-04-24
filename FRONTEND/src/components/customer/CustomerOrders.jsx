import React from "react";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";

// Mock data for orders
const mockOrders = [
  {
    id: 1,
    date: "2024-04-20",
    items: "5 kg Plastic, 2 kg Paper",
    status: "Completed",
    points: 150,
  },
  {
    id: 2,
    date: "2024-04-18",
    items: "3 kg Glass, 1 kg Metal",
    status: "In Progress",
    points: 80,
  },
  {
    id: 3,
    date: "2024-04-15",
    items: "10 kg Organic Waste",
    status: "Completed",
    points: 200,
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

export default function CustomerOrders() {
  const userInfo = useOutletContext();
  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h1">
          Your Orders
        </Typography>
        <Button
          variant="contained"
          className="customer-button"
          onClick={() => console.log("Create new order")}
        >
          New Order
        </Button>
      </Box>

      <Paper className="customer-card">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Coins Earned</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.items}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{order.points}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => console.log("View order", order.id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
