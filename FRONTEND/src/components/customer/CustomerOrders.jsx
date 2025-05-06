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
    locationHistory: [
      {
        time: "2024-04-20 08:30",
        location: "123 Green St, Eco City",
        status: "Order Created",
      },
      {
        time: "2024-04-20 09:15",
        location: "123 Green St, Eco City",
        status: "Collector Dispatched",
      },
      {
        time: "2024-04-20 10:30",
        location: "Main Recycling Facility, Quận 7",
        status: "En Route to Facility",
      },
      {
        time: "2024-04-20 13:45",
        location: "Main Recycling Facility, Quận 7",
        status: "Processing",
      },
      {
        time: "2024-04-20 16:20",
        location: "Main Recycling Facility, Quận 7",
        status: "Completed",
      },
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
    locationHistory: [
      {
        time: "2024-04-18 10:45",
        location: "456 Eco Lane, Green Town",
        status: "Order Created",
      },
      {
        time: "2024-04-18 12:30",
        location: "456 Eco Lane, Green Town",
        status: "Collector Assigned",
      },
      {
        time: "2024-04-19 09:00",
        location: "Quận 1, Hồ Chí Minh City",
        status: "Collector En Route",
      },
    ],
    collectorName: "Sarah Green",
    collectorContact: "555-0456",
    currentLocation: "Quận 1, Hồ Chí Minh City - Pickup zone",
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

// Available waste types for order creation with categories
const wasteCategories = [
  {
    name: "Recyclable Materials",
    types: [
      { id: "plastic", label: "Plastic", points: 10 },
      { id: "paper", label: "Paper", points: 5 },
      { id: "glass", label: "Glass", points: 15 },
      { id: "metal", label: "Metal", points: 20 },
      { id: "cardboard", label: "Cardboard", points: 8 },
      { id: "aluminum", label: "Aluminum", points: 25 },
    ],
  },
  {
    name: "Organic Waste",
    types: [
      { id: "food_waste", label: "Food Waste", points: 5 },
      { id: "garden_waste", label: "Garden Waste", points: 7 },
      { id: "compostable", label: "Compostable Materials", points: 6 },
    ],
  },
  {
    name: "Electronic Waste",
    types: [
      { id: "small_electronics", label: "Small Electronics", points: 25 },
      { id: "batteries", label: "Batteries", points: 10 },
      { id: "cables", label: "Cables & Wires", points: 15 },
      { id: "computer_parts", label: "Computer Parts", points: 30 },
    ],
  },
  {
    name: "Textiles",
    types: [
      { id: "clothing", label: "Clothing", points: 10 },
      { id: "fabrics", label: "Fabrics", points: 8 },
      { id: "shoes", label: "Shoes", points: 12 },
    ],
  },
  {
    name: "Hazardous Waste",
    types: [
      { id: "paint", label: "Paint", points: 15 },
      { id: "chemicals", label: "Chemicals", points: 20 },
      { id: "medical_waste", label: "Medical Waste", points: 25 },
    ],
  },
];

// Flatten waste types for calculating points
const wasteTypesMap = wasteCategories.reduce((acc, category) => {
  category.types.forEach((type) => {
    acc[type.id] = type.points;
  });
  return acc;
}, {});

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
  const [shippingAccountsDialogOpen, setShippingAccountsDialogOpen] =
    useState(false);
  const [addShippingAccountDialogOpen, setAddShippingAccountDialogOpen] =
    useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    address: "",
    items: [{ type: "", quantity: 1, unit: "kg" }],
    shippingAccountId: "",
  });
  const [confirmAlertOpen, setConfirmAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [newShippingAccount, setNewShippingAccount] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    provider: "",
  });
  const [shippingAccounts, setShippingAccounts] = useState([
    {
      id: "sa-001",
      name: "Green Transport Co.",
      phone: "555-0100",
      email: "contact@greentransport.com",
      address: "123 Transport St, Green City",
      provider: "Green Logistics",
      isDefault: true,
    },
    {
      id: "sa-002",
      name: "Eco Delivery Services",
      phone: "555-0200",
      email: "support@ecodelivery.com",
      address: "456 Eco Lane, Green Town",
      provider: "Eco Express",
      isDefault: false,
    },
  ]);

  const isMobile = useMediaQuery("(max-width:600px)");

  // Function to validate if user has linked shipping accounts
  const hasLinkedShippingAccounts = () => {
    return shippingAccounts.length > 0;
  };

  // Function to show alert
  const showAlert = (message, severity = "success") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setConfirmAlertOpen(true);
    setTimeout(() => setConfirmAlertOpen(false), 3000);
  };

  const handleCreateOrder = () => {
    // Check if user has linked shipping accounts
    if (!hasLinkedShippingAccounts()) {
      showAlert(
        "Please link at least one shipping account before creating orders.",
        "error"
      );
      setCreateDialogOpen(false);
      setShippingAccountsDialogOpen(true);
      return;
    }

    // In a real application, this would send the order to an API
    const order = {
      id: orders.length + 1,
      date: new Date().toISOString().split("T")[0],
      items: [...newOrder.items],
      status: "Pending Confirmation",
      points: calculatePoints(newOrder.items),
      address: newOrder.address,
      shippingAccountId: newOrder.shippingAccountId,
      shippingAccount: shippingAccounts.find(
        (acc) => acc.id === newOrder.shippingAccountId
      ),
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
    showAlert("Order created successfully!");
    setNewOrder({
      address: "",
      items: [{ type: "", quantity: 1, unit: "kg" }],
      shippingAccountId: "",
    });
  };

  const handleAddShippingAccount = () => {
    const newAccount = {
      id: `sa-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      ...newShippingAccount,
      isDefault: shippingAccounts.length === 0,
    };

    setShippingAccounts([...shippingAccounts, newAccount]);
    setAddShippingAccountDialogOpen(false);
    showAlert("Shipping account added successfully!");
    setNewShippingAccount({
      name: "",
      phone: "",
      email: "",
      address: "",
      provider: "",
    });
  };

  const handleEditShippingAccount = (accountId, updatedData) => {
    const updatedAccounts = shippingAccounts.map((account) =>
      account.id === accountId ? { ...account, ...updatedData } : account
    );
    setShippingAccounts(updatedAccounts);
    showAlert("Shipping account updated successfully!");
  };

  const handleDeleteShippingAccount = (accountId) => {
    const updatedAccounts = shippingAccounts.filter(
      (account) => account.id !== accountId
    );

    // If we're deleting the default account and there are other accounts,
    // set the first remaining one as default
    if (
      shippingAccounts.find((acc) => acc.id === accountId)?.isDefault &&
      updatedAccounts.length > 0
    ) {
      updatedAccounts[0].isDefault = true;
    }

    setShippingAccounts(updatedAccounts);
    showAlert("Shipping account removed successfully!");
  };

  const handleSetDefaultShippingAccount = (accountId) => {
    const updatedAccounts = shippingAccounts.map((account) => ({
      ...account,
      isDefault: account.id === accountId,
    }));
    setShippingAccounts(updatedAccounts);
    showAlert("Default shipping account updated!");
  };

  const calculatePoints = (items) => {
    // Calculate based on the new type IDs
    let total = 0;
    items.forEach((item) => {
      total += (wasteTypesMap[item.type] || 5) * item.quantity;
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
    // Set a small timeout to resolve the aria-hidden focus issue
    setTimeout(() => {
      setDetailsDialogOpen(true);
    }, 10);
  };

  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    // Set a small timeout to resolve the aria-hidden focus issue
    setTimeout(() => {
      setTrackingDialogOpen(true);
    }, 10);
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
          severity={alertSeverity}
          sx={{
            position: "fixed",
            top: "80px",
            right: "20px",
            zIndex: 9999,
            backgroundColor:
              alertSeverity === "success" ? "var(--light-green)" : "#FFF3E0",
            color:
              alertSeverity === "success" ? "var(--primary-green)" : "#E65100",
            border: `1px solid ${
              alertSeverity === "success" ? "var(--primary-green)" : "#FB8C00"
            }`,
          }}
          onClose={() => setConfirmAlertOpen(false)}
        >
          {alertMessage}
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
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            className="customer-button-secondary"
            onClick={() => setShippingAccountsDialogOpen(true)}
            sx={{
              borderColor: "var(--primary-green)",
              color: "var(--primary-green)",
            }}
          >
            Shipping Accounts
          </Button>
          <Button
            variant="contained"
            className="customer-button"
            onClick={() => {
              if (!hasLinkedShippingAccounts()) {
                showAlert(
                  "Please link at least one shipping account before creating orders.",
                  "error"
                );
                setShippingAccountsDialogOpen(true);
              } else {
                setCreateDialogOpen(true);
              }
            }}
            startIcon={<AddIcon />}
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            New Order
          </Button>
        </Box>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {!hasLinkedShippingAccounts() ? (
                <>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    To start creating orders, you need to link at least one
                    shipping account
                  </Typography>
                  <Button
                    variant="contained"
                    className="customer-button"
                    onClick={() => setShippingAccountsDialogOpen(true)}
                  >
                    Link Shipping Account
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  className="customer-button"
                  onClick={() => setCreateDialogOpen(true)}
                  startIcon={<AddIcon />}
                >
                  Create Your First Order
                </Button>
              )}
            </Box>
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

      {/* Shipping Accounts Dialog */}
      <Dialog
        open={shippingAccountsDialogOpen}
        onClose={() => setShippingAccountsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Manage Shipping Accounts
        </DialogTitle>
        <DialogContent dividers>
          {shippingAccounts.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No shipping accounts linked yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Link a shipping account to start creating recycling orders
              </Typography>
              <Button
                variant="contained"
                className="customer-button"
                onClick={() => {
                  setAddShippingAccountDialogOpen(true);
                  setShippingAccountsDialogOpen(false);
                }}
                startIcon={<AddIcon />}
              >
                Add Shipping Account
              </Button>
            </Box>
          ) : (
            <>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  Your Linked Shipping Accounts
                </Typography>
                <Button
                  variant="contained"
                  className="customer-button"
                  onClick={() => {
                    setAddShippingAccountDialogOpen(true);
                    setShippingAccountsDialogOpen(false);
                  }}
                  startIcon={<AddIcon />}
                  size="small"
                >
                  Add Account
                </Button>
              </Box>

              <Grid container spacing={2}>
                {shippingAccounts.map((account) => (
                  <Grid item xs={12} md={6} key={account.id}>
                    <Card
                      sx={{
                        border: account.isDefault
                          ? "2px solid var(--primary-green)"
                          : "1px solid var(--grey-300)",
                        position: "relative",
                        overflow: "visible",
                      }}
                    >
                      {account.isDefault && (
                        <Chip
                          label="Default"
                          color="success"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: 20,
                            backgroundColor: "var(--primary-green)",
                          }}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {account.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          Provider: {account.provider}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          Contact: {account.phone}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          Email: {account.email}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                          Address: {account.address}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            mt: 2,
                            gap: 1,
                          }}
                        >
                          {!account.isDefault && (
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() =>
                                handleSetDefaultShippingAccount(account.id)
                              }
                              sx={{
                                borderColor: "var(--primary-green)",
                                color: "var(--primary-green)",
                              }}
                            >
                              Set as Default
                            </Button>
                          )}
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                              // In a real app, you would open an edit dialog here
                              // For simplicity, we're just showing an alert
                              showAlert(
                                "Edit functionality would open a form",
                                "info"
                              );
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              handleDeleteShippingAccount(account.id)
                            }
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setShippingAccountsDialogOpen(false)}
            className="customer-button-secondary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Shipping Account Dialog */}
      <Dialog
        open={addShippingAccountDialogOpen}
        onClose={() => setAddShippingAccountDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Add Shipping Account
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Account Name"
                fullWidth
                value={newShippingAccount.name}
                onChange={(e) =>
                  setNewShippingAccount({
                    ...newShippingAccount,
                    name: e.target.value,
                  })
                }
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Provider/Company"
                fullWidth
                value={newShippingAccount.provider}
                onChange={(e) =>
                  setNewShippingAccount({
                    ...newShippingAccount,
                    provider: e.target.value,
                  })
                }
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={newShippingAccount.phone}
                onChange={(e) =>
                  setNewShippingAccount({
                    ...newShippingAccount,
                    phone: e.target.value,
                  })
                }
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={newShippingAccount.email}
                onChange={(e) =>
                  setNewShippingAccount({
                    ...newShippingAccount,
                    email: e.target.value,
                  })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                fullWidth
                multiline
                rows={2}
                value={newShippingAccount.address}
                onChange={(e) =>
                  setNewShippingAccount({
                    ...newShippingAccount,
                    address: e.target.value,
                  })
                }
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => {
              setAddShippingAccountDialogOpen(false);
              setShippingAccountsDialogOpen(true);
            }}
            className="customer-button-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleAddShippingAccount();
              setShippingAccountsDialogOpen(true);
            }}
            className="customer-button"
            disabled={
              !newShippingAccount.name ||
              !newShippingAccount.phone ||
              !newShippingAccount.provider
            }
          >
            Add Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Order Dialog - Updated with Shipping Account selection and categorized waste items */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Create New Recycling Order
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Order Details
              </Typography>

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Shipping Account</InputLabel>
                <Select
                  value={newOrder.shippingAccountId}
                  label="Shipping Account"
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      shippingAccountId: e.target.value,
                    })
                  }
                >
                  {shippingAccounts.map((account) => (
                    <MenuItem key={account.id} value={account.id}>
                      {account.name} {account.isDefault ? "(Default)" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Pickup Address"
                fullWidth
                value={newOrder.address}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, address: e.target.value })
                }
                margin="normal"
                required
                multiline
                rows={2}
              />

              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "var(--light-green)",
                  borderRadius: 1,
                }}
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
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold" }}
              >
                Items to Recycle
              </Typography>

              {newOrder.items.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 3,
                    p: 2,
                    border: "1px solid var(--grey-200)",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2">
                      Item {index + 1}
                    </Typography>
                    {index > 0 && (
                      <IconButton
                        onClick={() => handleRemoveItem(index)}
                        color="error"
                        size="small"
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>

                  <FormControl fullWidth required sx={{ mb: 2 }}>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={item.type}
                      label="Type"
                      onChange={(e) =>
                        handleItemChange(index, "type", e.target.value)
                      }
                    >
                      {wasteCategories
                        .map((category) => (
                          <MenuItem
                            key={category.name}
                            disabled
                            sx={{
                              opacity: 1,
                              fontWeight: "bold",
                              backgroundColor: "var(--light-green)",
                            }}
                          >
                            {category.name}
                          </MenuItem>
                        ))
                        .concat(
                          wasteCategories.flatMap((category) =>
                            category.types.map((type) => (
                              <MenuItem
                                key={type.id}
                                value={type.id}
                                sx={{ pl: 4 }}
                              >
                                {type.label} ({type.points} points/unit)
                              </MenuItem>
                            ))
                          )
                        )}
                    </Select>
                  </FormControl>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
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
                    <Grid item xs={6}>
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
                  </Grid>
                </Box>
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
            </Grid>
          </Grid>
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
              newOrder.shippingAccountId === "" ||
              newOrder.items.some((item) => item.type === "")
            }
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update the Order Details Dialog to replace map with text location */}
      {selectedOrder && (
        <Dialog
          open={trackingDialogOpen}
          onClose={() => setTrackingDialogOpen(false)}
          fullWidth
          maxWidth="md"
          aria-labelledby="tracking-dialog-title"
          disableRestoreFocus
        >
          <DialogTitle
            id="tracking-dialog-title"
            sx={{
              bgcolor: "var(--light-green)",
              color: "var(--primary-green)",
            }}
          >
            Track Order #{selectedOrder.id}
          </DialogTitle>
          <DialogContent dividers>
            {/* Enhanced location tracking history */}
            <Box
              sx={{
                mb: 3,
                borderRadius: 1,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: "var(--primary-green)",
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <TimelineIcon sx={{ mr: 1 }} /> Location History
              </Typography>

              {/* Location Timeline */}
              <Box sx={{ pl: 2 }}>
                {selectedOrder.locationHistory ? (
                  selectedOrder.locationHistory.map((item, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        mb:
                          index === selectedOrder.locationHistory.length - 1
                            ? 0
                            : 4,
                        position: "relative",
                      }}
                    >
                      {/* Location Pin */}
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          bgcolor:
                            index === selectedOrder.locationHistory.length - 1
                              ? "var(--primary-green)"
                              : "var(--light-green)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color:
                            index === selectedOrder.locationHistory.length - 1
                              ? "white"
                              : "var(--primary-green)",
                          border: "2px solid",
                          borderColor: "var(--primary-green)",
                          zIndex: 2,
                        }}
                      >
                        <LocationOnIcon />
                      </Box>

                      {/* Vertical connecting line */}
                      {index < selectedOrder.locationHistory.length - 1 && (
                        <Box
                          sx={{
                            position: "absolute",
                            left: 20,
                            top: 40,
                            bottom: -20,
                            width: 2,
                            bgcolor: "var(--grey-300)",
                            zIndex: 1,
                          }}
                        />
                      )}

                      {/* Location details */}
                      <Box sx={{ ml: 2, flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: "bold",
                            color:
                              index === selectedOrder.locationHistory.length - 1
                                ? "var(--primary-green)"
                                : "inherit",
                          }}
                        >
                          {item.location}
                          {index === selectedOrder.locationHistory.length - 1 &&
                            selectedOrder.status === "In Progress" && (
                              <Chip
                                label="Current"
                                color="success"
                                size="small"
                                sx={{ ml: 1, fontWeight: "bold" }}
                              />
                            )}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 0.5,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            {item.status}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.time}
                          </Typography>
                        </Box>

                        {/* Additional info for current location */}
                        {index === selectedOrder.locationHistory.length - 1 &&
                          selectedOrder.status === "In Progress" && (
                            <Box
                              sx={{
                                mt: 1,
                                p: 1,
                                bgcolor: "rgba(46, 125, 50, 0.05)",
                                borderRadius: 1,
                                border: "1px dashed var(--primary-green)",
                              }}
                            >
                              <Typography variant="body2">
                                <strong>Estimated arrival:</strong> 15 minutes
                              </Typography>
                            </Box>
                          )}
                      </Box>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    No location tracking available for this order.
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

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
                setTimeout(() => setDetailsDialogOpen(true), 10);
              }}
            >
              View Details
            </Button>
            <Button
              onClick={() => setTrackingDialogOpen(false)}
              className="customer-button"
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Also fix the Details Dialog */}
      {selectedOrder && (
        <Dialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
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
              autoFocus
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
