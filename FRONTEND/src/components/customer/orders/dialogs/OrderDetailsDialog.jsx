import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Button,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  handleConfirmOrder,
  handleCancelOrder,
  handleOpenEditBuyerInfo,
}) => {
  console.log("check order", order);
  if (!order) return null;
  const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
  if (!validStatuses.includes(order.data.status)) {
    console.log("check from order detail");
    return (
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="order-details-dialog-title"
      >
        <DialogTitle
          id="order-details-dialog-title"
          sx={{
            bgcolor: "var(--light-green)",
            color: "var(--primary-green)",
          }}
        >
          Order Details
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Transaction Information */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="var(--primary-green)"
                >
                  Order Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Order Code
                    </Typography>
                    <Typography variant="body1">
                      {order.data.order_code || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={order.data.status}
                      color={
                        order.data.status === "ready_to_pick"
                          ? "info"
                          : order.data.status === "picking"
                          ? "warning"
                          : order.data.status === "delivered"
                          ? "success"
                          : order.data.status === "cancel"
                          ? "error"
                          : "default"
                      }
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Created Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(order.data.created_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body1">
                      {new Date(order.data.updated_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* Product Information */}
            <Grid item xs={12}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="var(--primary-green)"
                >
                  Product Information
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          {order.item_snapshot?.name || "N/A"}
                        </TableCell>
                        <TableCell align="right">{order.quantity}</TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.item_snapshot?.price || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(order.total_price || 0)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            {/* Sender Information */}
            <Grid item xs={12}>
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="var(--primary-green)"
                >
                  Sender Information
                </Typography>
                <Grid container spacing={2}>
                  {order && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {order.data?.from_name || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact
                        </Typography>
                        <Typography variant="body1">
                          {order.data?.from_phone || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Shipping Address
                        </Typography>
                        <Typography variant="body1">
                          {`${order.data?.from_address}, ${order.data?.from_ward_name}, ${order.data?.from_district_name}, ${order.data?.from_province_name}`}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
            {/* Receiver Information */}
            <Grid item xs={12}>
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  color="var(--primary-green)"
                >
                  Receiver Information
                </Typography>
                <Grid container spacing={2}>
                  {order && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {order.data?.to_name || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact
                        </Typography>
                        <Typography variant="body1">
                          {order.data?.to_phone || "N/A"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Shipping Address
                        </Typography>
                        <Typography variant="body1">
                          {`${order.data?.to_address}, ${order.data?.to_ward_name}, ${order.data?.to_district_name}, ${order.data?.to_province_name}`}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          {order.status === "pending" && (
            <>
              <Button
                onClick={() => handleConfirmOrder(order.id)}
                className="customer-button"
                startIcon={<CheckCircleIcon />}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleCancelOrder(order.id)}
                color="error"
                variant="contained"
                startIcon={<CancelIcon />}
              >
                Reject
              </Button>
            </>
          )}
          {order.status === "rejected" && (
            <Button
              onClick={() => handleConfirmOrder(order.id)}
              className="customer-button"
              startIcon={<CheckCircleIcon />}
            >
              Accept
            </Button>
          )}
          <Button onClick={onClose} className="customer-button-secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="order-details-dialog-title"
    >
      <DialogTitle
        id="order-details-dialog-title"
        sx={{
          bgcolor: "var(--light-green)",
          color: "var(--primary-green)",
        }}
      >
        Order Details
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Transaction Information */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                color="var(--primary-green)"
              >
                Transaction Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Transaction ID
                  </Typography>
                  <Typography variant="body1">
                    {order.public_id || "N/A"}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={order.status}
                    color={
                      order.status === "pending"
                        ? "warning"
                        : order.status === "accepted"
                        ? "success"
                        : order.status === "rejected"
                        ? "error"
                        : "default"
                    }
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {new Date(order.updated_at).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Product Information */}
          <Grid item xs={12}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                gutterBottom
                color="var(--primary-green)"
              >
                Product Information
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        {order.item_snapshot?.name || "N/A"}
                      </TableCell>
                      <TableCell align="right">{order.quantity}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.item_snapshot?.price || 0)}
                      </TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.total_price || 0)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Grid>

          {/* Buyer Information */}
          <Grid item xs={12}>
            <Box>
              <Typography
                variant="h6"
                gutterBottom
                color="var(--primary-green)"
              >
                Buyer Information
              </Typography>
              <Grid container spacing={2}>
                {order.receiver_information && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {order.receiver_information?.to_name || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Contact
                      </Typography>
                      <Typography variant="body1">
                        {order.receiver_information?.to_phone || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Shipping Address
                      </Typography>
                      <Typography variant="body1">
                        {`${order.receiver_information.to_address}, ${order.receiver_information.to_ward_name}, ${order.receiver_information.to_district_name}, ${order.receiver_information.to_province_name}`}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {order.status === "pending" && (
          <>
            <Button
              onClick={() => handleConfirmOrder(order.id)}
              className="customer-button"
              startIcon={<CheckCircleIcon />}
            >
              Accept
            </Button>
            <Button
              onClick={() => handleCancelOrder(order.id)}
              color="error"
              variant="contained"
              startIcon={<CancelIcon />}
            >
              Reject
            </Button>
          </>
        )}
        {order.status === "rejected" && (
          <Button
            onClick={() => handleConfirmOrder(order.id)}
            className="customer-button"
            startIcon={<CheckCircleIcon />}
          >
            Accept
          </Button>
        )}
        <Button onClick={onClose} className="customer-button-secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsDialog;
