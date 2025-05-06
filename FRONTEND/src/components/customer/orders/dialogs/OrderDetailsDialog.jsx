import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Box,
  Chip,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import OrderTimeline from "../OrderTimeline";
import { getStatusColor } from "../../../../utils/orderUtils";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  handleConfirmOrder,
  handleCancelOrder,
}) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="details-dialog-title"
      disableRestoreFocus
    >
      <DialogTitle
        id="details-dialog-title"
        sx={{
          bgcolor: "var(--light-green)",
          color: "var(--primary-green)",
        }}
      >
        Order Details #{order.id}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Order Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Date: {order.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status:{" "}
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {order.address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coins Earned: {order.points}
              </Typography>
            </Box>

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: "bold" }}
            >
              Recycled Items
            </Typography>
            <TableContainer
              component={Paper}
              sx={{
                mb: 3,
                boxShadow: "none",
                border: "1px solid var(--grey-200)",
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Unit</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item.type}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{item.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {order.collectorName && (
              <>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "bold" }}
                >
                  Collector Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Name: {order.collectorName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contact: {order.collectorContact}
                  </Typography>
                </Box>
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <OrderTimeline timeline={order.timeline} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {order.status === "Pending Confirmation" && (
          <>
            <Button
              onClick={() => {
                handleConfirmOrder(order.id);
                onClose();
              }}
              className="customer-button"
              startIcon={<CheckCircleIcon />}
            >
              Confirm Order
            </Button>
            <Button
              onClick={() => {
                handleCancelOrder(order.id);
                onClose();
              }}
              color="error"
              variant="contained"
              startIcon={<CancelIcon />}
            >
              Cancel Order
            </Button>
          </>
        )}
        <Button
          onClick={onClose}
          className="customer-button-secondary"
          autoFocus
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
