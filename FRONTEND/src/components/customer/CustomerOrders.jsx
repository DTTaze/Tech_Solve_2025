import React, { useState, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TimelineIcon from "@mui/icons-material/Timeline";

// Enhanced order data with more details
const mockOrders = [
  {
    id: 1,
    date: "2024-04-20",
    items: [
      { type: "Plastic", quantity: 5, unit: "kg" },
      { type: "Paper", quantity: 2, unit: "kg" },
    ],
    status: "Completed",
    points: 150,
    address: "123 Green St, Eco City",
    timeline: [
      { time: "2024-04-20 08:30", status: "Order Created" },
      { time: "2024-04-20 09:15", status: "Collection Scheduled" },
      { time: "2024-04-20 13:45", status: "Recycling In Progress" },
      { time: "2024-04-20 16:20", status: "Completed" },
    ],
    collectorName: "John Recycler",
    collectorContact: "555-0123",
  },
  {
    id: 2,
    date: "2024-04-18",
    items: [
      { type: "Glass", quantity: 3, unit: "kg" },
      { type: "Metal", quantity: 1, unit: "kg" },
    ],
    status: "In Progress",
    points: 80,
    address: "456 Eco Lane, Green Town",
    timeline: [
      { time: "2024-04-18 10:45", status: "Order Created" },
      { time: "2024-04-18 12:30", status: "Collection Scheduled" },
      { time: "2024-04-19 09:00", status: "Collector En Route" },
    ],
    collectorName: "Sarah Green",
    collectorContact: "555-0456",
    location: { lat: 10.762622, lng: 106.660172 }, // Sample location
  },
  {
    id: 3,
    date: "2024-04-15",
    items: [{ type: "Organic Waste", quantity: 10, unit: "kg" }],
    status: "Pending Confirmation",
    points: 200,
    address: "789 Sustainability Rd, Eco Heights",
    timeline: [
      { time: "2024-04-15 14:20", status: "Order Created" },
      { time: "2024-04-15 15:00", status: "Waiting for Confirmation" },
    ],
  },
  {
    id: 4,
    date: "2024-04-10",
    items: [
      { type: "Electronic Waste", quantity: 2, unit: "items" },
      { type: "Batteries", quantity: 5, unit: "items" },
    ],
    status: "Cancelled",
    points: 0,
    address: "101 Green Avenue, Eco Park",
    timeline: [
      { time: "2024-04-10 09:15", status: "Order Created" },
      { time: "2024-04-10 11:30", status: "Collection Scheduled" },
      { time: "2024-04-10 14:45", status: "Cancelled by User" },
    ],
  },
];

// Available waste types for order creation
const wasteTypes = [
  "Plastic",
  "Paper",
  "Glass",
  "Metal",
  "Organic Waste",
  "Electronic Waste",
  "Batteries",
  "Clothing/Textiles",
];

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Pending Confirmation":
      return "info";
    case "Cancelled":
      return "error";
    default:
      return "default";
  }
};

export default function CustomerOrders() {
  const userInfo = useOutletContext();
  const [orders, setOrders] = useState(mockOrders);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    address: "",
    items: [{ type: "", quantity: 1, unit: "kg" }],
  });
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleCreateOrder = () => {
    // In a real application, this would send the order to an API
    const order = {
      id: orders.length + 1,
      date: new Date().toISOString().split("T")[0],
      items: [...newOrder.items],
      status: "Pending Confirmation",
      points: calculatePoints(newOrder.items),
      address: newOrder.address,
      timeline: [
        {
          time: new Date().toLocaleString(),
          status: "Order Created",
        },
        {
          time: new Date().toLocaleString(),
          status: "Waiting for Confirmation",
        },
      ],
    };

    setOrders([order, ...orders]);
    setCreateDialogOpen(false);
    setNewOrder({
      address: "",
      items: [{ type: "", quantity: 1, unit: "kg" }],
    });
  };

  const calculatePoints = (items) => {
    // Sample calculation - in a real app this would follow business rules
    let total = 0;
    items.forEach((item) => {
      const basePoints = {
        Plastic: 10,
        Paper: 5,
        Glass: 15,
        Metal: 20,
        "Organic Waste": 5,
        "Electronic Waste": 25,
        Batteries: 10,
        "Clothing/Textiles": 10,
      };
      total += (basePoints[item.type] || 5) * item.quantity;
    });
    return total;
  };

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { type: "", quantity: 1, unit: "kg" }],
    });
  };

  const handleRemoveItem = (index) => {
    const items = [...newOrder.items];
    items.splice(index, 1);
    setNewOrder({ ...newOrder, items });
  };

  const handleItemChange = (index, field, value) => {
    const items = [...newOrder.items];
    items[index][field] = value;
    setNewOrder({ ...newOrder, items });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsDialogOpen(true);
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setTrackingDialogOpen(true);
  };

  const handleCancelOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const newTimeline = [
          ...order.timeline,
          {
            time: new Date().toLocaleString(),
            status: "Cancelled by User",
          },
        ];
        return {
          ...order,
          status: "Cancelled",
          timeline: newTimeline,
          points: 0,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const handleConfirmOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const newTimeline = [
          ...order.timeline,
          {
            time: new Date().toLocaleString(),
            status: "Confirmed by User",
          },
        ];
        return {
          ...order,
          status: "In Progress",
          timeline: newTimeline,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    setConfirmAlertOpen(true);
    setTimeout(() => setConfirmAlertOpen(false), 3000);
  };

  return (
    <Box>
      {confirmAlertOpen && (
        <Alert
          severity="success"
          sx={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            backgroundColor: "var(--light-green)",
            color: "var(--primary-green)",
            border: "1px solid var(--primary-green)",
          }}
          onClose={() => setConfirmAlertOpen(false)}
        >
          Order confirmed successfully. A collector will be assigned soon.
        </Alert>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Typography
          variant="h5"
          component="h1"
          sx={{ color: "var(--primary-green)" }}
        >
          Your Orders
        </Typography>
        <Button
          variant="contained"
          className="customer-button"
          onClick={() => setCreateDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          New Order
        </Button>
      </Box>

      {orders.length === 0 ? (
        <Card className="customer-card">
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, color: "var(--text-light)" }}>
              You don't have any orders yet
            </Typography>
            <Button
              variant="contained"
              className="customer-button"
              onClick={() => setCreateDialogOpen(true)}
              startIcon={<AddIcon />}
            >
              Create Your First Order
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop view */}
          {!isMobile && (
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
                    {orders.map((order) => (
                      <TableRow
                        key={order.id}
                        sx={{
                          backgroundColor:
                            order.status === "Pending Confirmation"
                              ? "rgba(46, 125, 50, 0.05)"
                              : "inherit",
                        }}
                      >
                        <TableCell>{order.date}</TableCell>
                        <TableCell>
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              {item.quantity} {item.unit} {item.type}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{order.points}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => handleViewDetails(order)}
                              sx={{
                                minWidth: 0,
                                p: "4px 8px",
                                borderColor: "var(--primary-green)",
                                color: "var(--primary-green)",
                                "&:hover": {
                                  borderColor: "var(--dark-green)",
                                  backgroundColor: "rgba(46, 125, 50, 0.08)",
                                },
                              }}
                            >
                              <ReceiptIcon fontSize="small" />
                            </Button>

                            {order.status === "In Progress" && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleTrackOrder(order)}
                                sx={{
                                  minWidth: 0,
                                  p: "4px 8px",
                                  borderColor: "var(--primary-green)",
                                  color: "var(--primary-green)",
                                  "&:hover": {
                                    borderColor: "var(--dark-green)",
                                    backgroundColor: "rgba(46, 125, 50, 0.08)",
                                  },
                                }}
                              >
                                <LocationOnIcon fontSize="small" />
                              </Button>
                            )}

                            {order.status === "Pending Confirmation" && (
                              <>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="success"
                                  onClick={() => handleConfirmOrder(order.id)}
                                  sx={{
                                    minWidth: 0,
                                    p: "4px 8px",
                                    bgcolor: "var(--primary-green)",
                                    "&:hover": { bgcolor: "var(--dark-green)" },
                                  }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="error"
                                  onClick={() => handleCancelOrder(order.id)}
                                  sx={{
                                    minWidth: 0,
                                    p: "4px 8px",
                                  }}
                                >
                                  <CancelIcon fontSize="small" />
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          )}

          {/* Mobile view */}
          {isMobile && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {orders.map((order) => (
                <Accordion
                  key={order.id}
                  sx={{
                    border:
                      order.status === "Pending Confirmation"
                        ? "1px solid var(--primary-green)"
                        : "1px solid var(--grey-300)",
                    borderRadius: "8px !important",
                    "&:before": {
                      display: "none",
                    },
                    mb: 1,
                    backgroundColor:
                      order.status === "Pending Confirmation"
                        ? "rgba(46, 125, 50, 0.05)"
                        : "var(--white)",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`order-${order.id}-content`}
                    id={`order-${order.id}-header`}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          Order #{order.id}
                        </Typography>
                        <Chip
                          label={order.status}
                          color={getStatusColor(order.status)}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {order.date}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          Items:
                        </Typography>
                        {order.items.map((item, idx) => (
                          <Typography key={idx} variant="body2">
                            • {item.quantity} {item.unit} {item.type}
                          </Typography>
                        ))}
                      </Box>

                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          Coins Earned: {order.points}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "flex-end",
                          mt: 1,
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewDetails(order)}
                          sx={{
                            borderColor: "var(--primary-green)",
                            color: "var(--primary-green)",
                            "&:hover": {
                              borderColor: "var(--dark-green)",
                              backgroundColor: "rgba(46, 125, 50, 0.08)",
                            },
                          }}
                        >
                          Details
                        </Button>

                        {order.status === "In Progress" && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleTrackOrder(order)}
                            sx={{
                              borderColor: "var(--primary-green)",
                              color: "var(--primary-green)",
                              "&:hover": {
                                borderColor: "var(--dark-green)",
                                backgroundColor: "rgba(46, 125, 50, 0.08)",
                              },
                            }}
                          >
                            Track
                          </Button>
                        )}

                        {order.status === "Pending Confirmation" && (
                          <>
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              onClick={() => handleConfirmOrder(order.id)}
                              sx={{
                                bgcolor: "var(--primary-green)",
                                "&:hover": { bgcolor: "var(--dark-green)" },
                              }}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </>
      )}

      {/* Create Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Create New Recycling Order
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add details about the waste you want to recycle
            </Typography>
          </Box>

          <TextField
            label="Pickup Address"
            fullWidth
            value={newOrder.address}
            onChange={(e) =>
              setNewOrder({ ...newOrder, address: e.target.value })
            }
            margin="normal"
            required
          />

          <Typography variant="subtitle2" sx={{ mt: 3, mb: 2 }}>
            Items to Recycle:
          </Typography>

          {newOrder.items.map((item, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth required>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={item.type}
                    label="Type"
                    onChange={(e) =>
                      handleItemChange(index, "type", e.target.value)
                    }
                  >
                    {wasteTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Quantity"
                  type="number"
                  fullWidth
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      "quantity",
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  }
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Unit</InputLabel>
                  <Select
                    value={item.unit}
                    label="Unit"
                    onChange={(e) =>
                      handleItemChange(index, "unit", e.target.value)
                    }
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="items">items</MenuItem>
                    <MenuItem value="bags">bags</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={1}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {index > 0 && (
                  <IconButton
                    onClick={() => handleRemoveItem(index)}
                    color="error"
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddItem}
            sx={{
              mt: 1,
              color: "var(--primary-green)",
              "&:hover": {
                backgroundColor: "rgba(46, 125, 50, 0.08)",
              },
            }}
          >
            Add Another Item
          </Button>

          <Box
            sx={{ mt: 3, p: 2, bgcolor: "var(--light-green)", borderRadius: 1 }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "var(--primary-green)" }}
            >
              Estimated Coins: {calculatePoints(newOrder.items)}
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              Final amount may vary based on actual weight and quality
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setCreateDialogOpen(false)}
            className="customer-button-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrder}
            className="customer-button"
            disabled={
              newOrder.address === "" ||
              newOrder.items.some((item) => item.type === "")
            }
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              bgcolor: "var(--light-green)",
              color: "var(--primary-green)",
            }}
          >
            Order Details #{selectedOrder.id}
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
                    Date: {selectedOrder.date}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status:{" "}
                    <Chip
                      label={selectedOrder.status}
                      color={getStatusColor(selectedOrder.status)}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Address: {selectedOrder.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Coins Earned: {selectedOrder.points}
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
                      {selectedOrder.items.map((item, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{item.type}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell align="right">{item.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {selectedOrder.collectorName && (
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
                        Name: {selectedOrder.collectorName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Contact: {selectedOrder.collectorContact}
                      </Typography>
                    </Box>
                  </>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TimelineIcon sx={{ mr: 1, color: "var(--primary-green)" }} />{" "}
                  Order Timeline
                </Typography>
                <Box sx={{ maxHeight: "400px", overflow: "auto", pr: 1 }}>
                  <Stepper orientation="vertical" sx={{ mt: 2 }}>
                    {selectedOrder.timeline.map((step, index) => (
                      <Step key={index} active={true} completed={true}>
                        <StepLabel
                          StepIconProps={{
                            sx: { color: "var(--primary-green)" },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "bold" }}
                          >
                            {step.status}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {step.time}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            {selectedOrder.status === "Pending Confirmation" && (
              <>
                <Button
                  onClick={() => {
                    handleConfirmOrder(selectedOrder.id);
                    setDetailsDialogOpen(false);
                  }}
                  className="customer-button"
                  startIcon={<CheckCircleIcon />}
                >
                  Confirm Order
                </Button>
                <Button
                  onClick={() => {
                    handleCancelOrder(selectedOrder.id);
                    setDetailsDialogOpen(false);
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
              onClick={() => setDetailsDialogOpen(false)}
              className="customer-button-secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Order Tracking Dialog */}
      {selectedOrder && (
        <Dialog
          open={trackingDialogOpen}
          onClose={() => setTrackingDialogOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              bgcolor: "var(--light-green)",
              color: "var(--primary-green)",
            }}
          >
            Track Order #{selectedOrder.id}
          </DialogTitle>
          <DialogContent dividers>
            <Box
              sx={{
                height: "300px",
                bgcolor: "var(--grey-200)",
                mb: 3,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 1,
              }}
            >
              {/* In a real app, this would be a Google Maps component showing the collector's location */}
              <Box sx={{ textAlign: "center" }}>
                <LocationOnIcon
                  sx={{ fontSize: 60, color: "var(--primary-green)" }}
                />
                <Typography>Map showing collector's location</Typography>
                <Typography variant="caption">
                  (This would be a real map in production)
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Current Status
              </Typography>
              <Typography variant="body1">
                {
                  selectedOrder.timeline[selectedOrder.timeline.length - 1]
                    .status
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last updated:{" "}
                {selectedOrder.timeline[selectedOrder.timeline.length - 1].time}
              </Typography>
            </Box>

            {selectedOrder.collectorName && (
              <Box
                sx={{ p: 2, bgcolor: "var(--light-green)", borderRadius: 1 }}
              >
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: "bold", color: "var(--primary-green)" }}
                >
                  Collector Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Name: {selectedOrder.collectorName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      Contact: {selectedOrder.collectorContact}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button
              className="customer-button-secondary"
              startIcon={<ReceiptIcon />}
              onClick={() => {
                setTrackingDialogOpen(false);
                setDetailsDialogOpen(true);
              }}
            >
              View Details
            </Button>
            <Button
              onClick={() => setTrackingDialogOpen(false)}
              className="customer-button"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
