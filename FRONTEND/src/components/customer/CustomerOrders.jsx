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
import EditIcon from "@mui/icons-material/Edit";

// Import extracted components
import OrdersList from "./orders/OrdersList";
import EmptyOrderState from "./orders/EmptyOrderState";
import CreateOrderForm from "./orders/forms/CreateOrderForm";
import AddShippingAccountForm from "./orders/forms/AddShippingAccountForm";
import ShippingAccountsList from "./orders/ShippingAccountsList";
import OrderDetailsDialog from "./orders/dialogs/OrderDetailsDialog";
import OrderTrackingDialog from "./orders/dialogs/OrderTrackingDialog";

// Import mock data and utilities
import {
  mockOrders,
  wasteCategories,
  wasteTypesMap,
} from "../../data/ordersMockData"; // Ideally this would be in a separate file

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
  const [editShippingAccountDialogOpen, setEditShippingAccountDialogOpen] =
    useState(false);
  const [buyerInfoDialogOpen, setBuyerInfoDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedShippingAccount, setSelectedShippingAccount] = useState(null);
  const [isEditingShippingAccount, setIsEditingShippingAccount] =
    useState(false);
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
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
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
      locationHistory: [
        {
          time: new Date().toLocaleString(),
          location: newOrder.address,
          status: "Order Created",
        },
      ],
      collectorName: "John Recycler",
      collectorContact: "555-0123",
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      notes: "",
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

  const handleEditShippingAccount = (account) => {
    setSelectedShippingAccount(account);
    setNewShippingAccount({
      name: account.name,
      phone: account.phone,
      email: account.email,
      address: account.address,
      provider: account.provider,
    });
    setIsEditingShippingAccount(true);
    setShippingAccountsDialogOpen(false);
    setAddShippingAccountDialogOpen(true);
  };

  const handleUpdateShippingAccount = () => {
    const updatedAccounts = shippingAccounts.map((account) =>
      account.id === selectedShippingAccount.id
        ? {
            ...account,
            name: newShippingAccount.name,
            phone: newShippingAccount.phone,
            email: newShippingAccount.email,
            address: newShippingAccount.address,
            provider: newShippingAccount.provider,
          }
        : account
    );

    setShippingAccounts(updatedAccounts);
    setAddShippingAccountDialogOpen(false);
    setIsEditingShippingAccount(false);
    showAlert("Shipping account updated successfully!");
    setNewShippingAccount({
      name: "",
      phone: "",
      email: "",
      address: "",
      provider: "",
    });
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

  const handleOpenEditBuyerInfo = (order) => {
    setSelectedOrder(order);
    setBuyerInfo({
      name: order.buyerName || "",
      phone: order.buyerPhone || "",
      email: order.buyerEmail || "",
      notes: order.notes || "",
    });
    setBuyerInfoDialogOpen(true);
  };

  const handleUpdateBuyerInfo = () => {
    const updatedOrders = orders.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          buyerName: buyerInfo.name,
          buyerPhone: buyerInfo.phone,
          buyerEmail: buyerInfo.email,
          notes: buyerInfo.notes,
        };
      }
      return order;
    });

    setOrders(updatedOrders);
    setBuyerInfoDialogOpen(false);
    showAlert("Buyer information updated successfully!");
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

        const newLocationHistory = [
          ...(order.locationHistory || []),
          {
            time: new Date().toLocaleString(),
            location: order.address,
            status: "Order Cancelled",
          },
        ];

        return {
          ...order,
          status: "Cancelled",
          timeline: newTimeline,
          locationHistory: newLocationHistory,
          points: 0,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    showAlert("Order has been cancelled.");
  };

  const handleConfirmOrder = (orderId) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        const timestamp = new Date().toLocaleString();
        const newTimeline = [
          ...order.timeline,
          {
            time: timestamp,
            status: "Confirmed by User",
          },
        ];

        const newLocationHistory = [
          ...(order.locationHistory || []),
          {
            time: timestamp,
            location: order.address,
            status: "Order Confirmed",
          },
        ];

        return {
          ...order,
          status: "In Progress",
          timeline: newTimeline,
          locationHistory: newLocationHistory,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    showAlert(
      "Order confirmed successfully. A collector will be assigned soon."
    );
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
        <EmptyOrderState
          hasLinkedShippingAccounts={hasLinkedShippingAccounts()}
          handleOpenCreateDialog={() => setCreateDialogOpen(true)}
          handleOpenShippingAccountsDialog={() =>
            setShippingAccountsDialogOpen(true)
          }
        />
      ) : (
        <OrdersList
          orders={orders}
          handleViewDetails={handleViewDetails}
          handleTrackOrder={handleTrackOrder}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
        />
      )}

      {/* Shipping Accounts Dialog */}
      <Dialog
        open={shippingAccountsDialogOpen}
        onClose={() => setShippingAccountsDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <ShippingAccountsList
          shippingAccounts={shippingAccounts}
          handleSetDefaultShippingAccount={handleSetDefaultShippingAccount}
          handleEditShippingAccount={handleEditShippingAccount}
          handleDeleteShippingAccount={handleDeleteShippingAccount}
          handleOpenAddDialog={() => {
            setShippingAccountsDialogOpen(false);
            setIsEditingShippingAccount(false);
            setAddShippingAccountDialogOpen(true);
          }}
          handleCloseDialog={() => setShippingAccountsDialogOpen(false)}
        />
      </Dialog>

      {/* Add/Edit Shipping Account Dialog */}
      <Dialog
        open={addShippingAccountDialogOpen}
        onClose={() => {
          setAddShippingAccountDialogOpen(false);
          if (isEditingShippingAccount) {
            setShippingAccountsDialogOpen(true);
          }
        }}
        fullWidth
        maxWidth="sm"
      >
        <AddShippingAccountForm
          newShippingAccount={newShippingAccount}
          setNewShippingAccount={setNewShippingAccount}
          handleAddShippingAccount={handleAddShippingAccount}
          handleUpdateShippingAccount={handleUpdateShippingAccount}
          handleCloseDialog={() => setAddShippingAccountDialogOpen(false)}
          handleOpenManageDialog={() => setShippingAccountsDialogOpen(true)}
          isEditing={isEditingShippingAccount}
        />
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <CreateOrderForm
          newOrder={newOrder}
          setNewOrder={setNewOrder}
          handleCreateOrder={handleCreateOrder}
          handleCloseDialog={() => setCreateDialogOpen(false)}
          calculatePoints={calculatePoints}
          shippingAccounts={shippingAccounts}
          wasteCategories={wasteCategories}
          handleAddItem={handleAddItem}
          handleRemoveItem={handleRemoveItem}
          handleItemChange={handleItemChange}
        />
      </Dialog>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <OrderDetailsDialog
          open={detailsDialogOpen}
          onClose={() => setDetailsDialogOpen(false)}
          order={selectedOrder}
          handleConfirmOrder={handleConfirmOrder}
          handleCancelOrder={handleCancelOrder}
          handleOpenEditBuyerInfo={handleOpenEditBuyerInfo}
        />
      )}

      {/* Order Tracking Dialog */}
      {selectedOrder && (
        <OrderTrackingDialog
          open={trackingDialogOpen}
          onClose={() => setTrackingDialogOpen(false)}
          order={selectedOrder}
          handleViewDetails={handleViewDetails}
        />
      )}

      {/* Edit Buyer Information Dialog */}
      <Dialog
        open={buyerInfoDialogOpen}
        onClose={() => setBuyerInfoDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ bgcolor: "var(--light-green)", color: "var(--primary-green)" }}
        >
          Update Buyer Information
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Buyer Name"
                fullWidth
                value={buyerInfo.name}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, name: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                value={buyerInfo.phone}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, phone: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                type="email"
                value={buyerInfo.email}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, email: e.target.value })
                }
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Additional Notes"
                fullWidth
                multiline
                rows={3}
                value={buyerInfo.notes}
                onChange={(e) =>
                  setBuyerInfo({ ...buyerInfo, notes: e.target.value })
                }
                margin="normal"
                placeholder="Special instructions or requests"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setBuyerInfoDialogOpen(false)}
            className="customer-button-secondary"
          >
            Cancel
          </Button>
          <Button onClick={handleUpdateBuyerInfo} className="customer-button">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
