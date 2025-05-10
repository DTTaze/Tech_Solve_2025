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
  Stack,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InventoryIcon from "@mui/icons-material/Inventory";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const OrderDetailsDialog = ({
  open,
  onClose,
  order,
  handleConfirmOrder,
  handleCancelOrder,
  handleOpenEditBuyerInfo,
}) => {
  if (!order) return null;

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Custom Timeline Component
  const TimelineEvent = ({ date, status, icon: Icon, isLast }) => (
    <Box sx={{ display: "flex", mb: isLast ? 0 : 2 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mr: 2,
        }}
      >
        <Avatar
          sx={{
            width: 35,
            height: 35,
            bgcolor: "var(--primary-green)",
            color: "white",
          }}
        >
          <Icon fontSize="small" />
        </Avatar>
        {!isLast && (
          <Box
            sx={{
              width: 2,
              height: "100%",
              bgcolor: "var(--primary-green)",
              my: 1,
            }}
          />
        )}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {formatDate(date)}
        </Typography>
        <Typography variant="body1">{status}</Typography>
      </Box>
    </Box>
  );

  const validStatuses = ["pending", "accepted", "rejected", "cancelled"];
  const isPendingOrder = validStatuses.includes(order.status);

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
          {isPendingOrder ? (
            // Content for pending orders
            <>
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
                        {formatDate(order.created_at)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(order.updated_at)}
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
                            {formatCurrency(order.item_snapshot?.price || 0)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(order.total_price || 0)}
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
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Name
                          </Typography>
                          <Typography variant="body1">
                            {order.receiver_information?.to_name || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
                            Contact
                          </Typography>
                          <Typography variant="body1">
                            {order.receiver_information?.to_phone || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography
                            variant="subtitle2"
                            color="text.secondary"
                          >
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
            </>
          ) : (
            // Content for other orders
            <>
              {/* Basic Order Information */}
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
                        {order.data?.order_code || order.order_code || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Status
                      </Typography>
                      <Chip
                        label={order.data?.status || order.status}
                        color={
                          order.data?.status === "ready_to_pick" ||
                          order.status === "ready_to_pick"
                            ? "info"
                            : order.data?.status === "picking" ||
                              order.status === "picking"
                            ? "warning"
                            : order.data?.status === "delivered" ||
                              order.status === "delivered"
                            ? "success"
                            : order.data?.status === "cancel" ||
                              order.status === "cancel"
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
                        {formatDate(
                          order.data?.created_date || order.created_at
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Last Updated
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(
                          order.data?.updated_date || order.updated_at
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Package Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="var(--primary-green)"
                  >
                    Package Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Weight
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.weight || order.weight || 0}g
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Dimensions
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.length || order.length || 0} x{" "}
                        {order.data?.width || order.width || 0} x{" "}
                        {order.data?.height || order.height || 0} cm
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        COD Amount
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(
                          order.data?.cod_amount || order.cod_amount
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Insurance Value
                      </Typography>
                      <Typography variant="body1">
                        {formatCurrency(
                          order.data?.insurance_value || order.insurance_value
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Sender Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="var(--primary-green)"
                  >
                    Sender Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.from_name || order.from_name || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.from_phone || order.from_phone || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.from_address ||
                          order.from_address ||
                          "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Receiver Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    color="var(--primary-green)"
                  >
                    Receiver Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.to_name || order.to_name || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.to_phone || order.to_phone || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Address
                      </Typography>
                      <Typography variant="body1">
                        {order.data?.to_address || order.to_address || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              {/* Timeline */}
              {order.timeline && order.timeline.length > 0 && (
                <Grid item xs={12}>
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="var(--primary-green)"
                    >
                      Order Timeline
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {order.timeline.map((event, index) => (
                        <TimelineEvent
                          key={index}
                          date={event.time}
                          status={event.status}
                          icon={LocalShippingIcon}
                          isLast={index === order.timeline.length - 1}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Location History */}
              {order.locationHistory && order.locationHistory.length > 0 && (
                <Grid item xs={12}>
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      color="var(--primary-green)"
                    >
                      Location History
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {order.locationHistory.map((location, index) => (
                        <TimelineEvent
                          key={index}
                          date={location.time}
                          status={`${location.location} - ${location.status}`}
                          icon={LocationOnIcon}
                          isLast={index === order.locationHistory.length - 1}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              )}
            </>
          )}
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
